import { NextRequest } from "next/server";

import { ChatService } from "@/services/chat.service";
import { chatSchema } from "@/lib/validators/chat";
import { ChatCompletionService } from "@/services/chat-completion.service";
import { getCurrentUserId } from "@/lib/auth/current-user";
import { handleApiError } from "@/lib/api/handle-error";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const userId = await getCurrentUserId();

    const { chatId } = await params;

    const body = chatSchema.parse(await request.json());

    // Verify the chat's repository belongs to the current user before
    // touching the retrieval/completion pipeline.
    await ChatService.requireOwned(userId, chatId);

    const prepared = await ChatService.prepare(chatId, body.question);

    const stream = await ChatCompletionService.stream(prepared.prompt);

    const encoder = new TextEncoder();

    const MARKER = "<<<SOURCES>>>";

    let fullResponse = "";
    let streamedLength = 0;

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            fullResponse += chunk.text ?? "";

            const markerIndex = fullResponse.indexOf(MARKER);

            // Show everything before the marker. Until the marker appears, hold
            // back the last 12 characters, because they could be its first half.
            const safeEnd =
              markerIndex === -1
                ? Math.max(0, fullResponse.length - (MARKER.length - 1))
                : markerIndex;

            const newChunk = fullResponse.slice(streamedLength, safeEnd);

            if (newChunk.length > 0) {
              streamedLength += newChunk.length;
              controller.enqueue(encoder.encode(newChunk));
            }
          }

          // Send whatever was held back, now that the stream is finished.
          const endIndex = fullResponse.indexOf(MARKER);
          const visibleText =
            endIndex === -1 ? fullResponse : fullResponse.slice(0, endIndex);
          const rest = visibleText.slice(streamedLength);

          if (rest.length > 0) {
            controller.enqueue(encoder.encode(rest));
          }

          const marker = "<<<SOURCES>>>";

          const [answer, sourcesPart = "[]"] = fullResponse.split(marker);

          let sourceIndices: number[] = [];

          try {
            sourceIndices = JSON.parse(sourcesPart.trim());
          } catch {
            console.warn("Failed to parse Gemini sources:", sourcesPart);
          }

          const selectedChunks = sourceIndices
            .map((index) => prepared.chunks[index])
            .filter(Boolean);

          await ChatService.saveAssistant(
            prepared.chatId,
            answer.trim(),
            selectedChunks,
            prepared.title,
          );

          const sourcesForClient = selectedChunks.map((chunk) => ({
            filePath: chunk.filePath,
            startLine: chunk.startLine,
            endLine: chunk.endLine,
          }));

          controller.enqueue(
            encoder.encode(
              `<<<SOURCES_JSON>>>${JSON.stringify(sourcesForClient)}`,
            ),
          );

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
