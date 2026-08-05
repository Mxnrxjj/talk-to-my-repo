import { SearchService } from "@/services/search.service";
import { ChatCompletionService } from "@/services/chat-completion.service";
import { ChatResponse } from "@/types/chat";
import { db } from "@/lib/db";
import { NotFoundError } from "@/lib/errors/not-found-error";

export class ChatService {
  static async answer(chatId: string, question: string): Promise<ChatResponse> {
    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    const messages = await db.chatMessage.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!chat) {
      throw new NotFoundError(`Chat ${chatId} not found`);
    }

    const chunks = await SearchService.search(chat.repositoryId, question);

    const context = chunks
      .map(
        (chunk) => `File: ${chunk.filePath}
        Lines: ${chunk.startLine}-${chunk.endLine}

        ${chunk.content}`,
      )
      .join("\n\n---\n\n");

    const history = messages
      .map(
        (message) => `${message.role === "user" ? "User" : "Assistant"}:

        ${message.content}`,
      )
      .join("\n\n");

    const prompt = `
        You are an expert software engineer.

        Answer the user's question using ONLY the repository context below.

        If the answer cannot be determined from the context, say you don't know.

        Conversation History:

        ${history || "No previous conversation."}

        Repository Context:

        ${context}

        Question:

        ${question}
    `;

    const completion = await ChatCompletionService.complete(prompt);

    await db.chatMessage.createMany({
      data: [
        {
          chatId,
          role: "user",
          content: question,
        },
        {
          chatId,
          role: "assistant",
          content: completion.answer,
        },
      ],
    });

    const sources = new Map<
      string,
      {
        filePath: string;
        startLine: number;
        endLine: number;
      }
    >();

    const normalizedSources = new Set(
      completion.sources.map((path) => path.replaceAll("\\", "/")),
    );

    for (const chunk of chunks) {
      const filePath = chunk.filePath.replaceAll("\\", "/");

      if (!normalizedSources.has(filePath)) {
        continue;
      }

      const existing = sources.get(chunk.filePath);

      if (!existing) {
        sources.set(chunk.filePath, {
          filePath: chunk.filePath,
          startLine: chunk.startLine,
          endLine: chunk.endLine,
        });
        continue;
      }

      existing.startLine = Math.min(existing.startLine, chunk.startLine);
      existing.endLine = Math.max(existing.endLine, chunk.endLine);
    }

    return {
      answer: completion.answer,
      sources: [...sources.values()],
    };
  }
}
