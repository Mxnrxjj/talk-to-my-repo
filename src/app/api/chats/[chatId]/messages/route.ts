import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { NotFoundError } from "@/lib/errors/not-found-error";

import { ChatService } from "@/services/chat.service";
import { chatSchema } from "@/lib/validators/chat";
import { ChatCompletionService } from "@/services/chat-completion.service";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> },
) {
  try {
    const { chatId } = await params;

    const body = chatSchema.parse(await request.json());

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
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    if (error instanceof NotFoundError) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 404,
        },
      );
    }

    throw error;
  }
}
