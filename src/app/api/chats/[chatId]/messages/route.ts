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

    let fullResponse = "";
    let streamedLength = 0;

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text ?? "";

            fullResponse += text;

            const marker = "<<<SOURCES>>>";

            const markerIndex = fullResponse.indexOf(marker);

            const visibleText =
              markerIndex === -1
                ? fullResponse
                : fullResponse.slice(0, markerIndex);

            const newChunk = visibleText.slice(streamedLength);

            if (newChunk.length > 0) {
              streamedLength += newChunk.length;
              controller.enqueue(encoder.encode(newChunk));
            }

            controller.enqueue(encoder.encode(text));
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
