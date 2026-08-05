import { SearchService } from "@/services/search.service";
import { ChatCompletionService } from "@/services/chat-completion.service";
import { ChatResponse } from "@/types/chat-response";

export class ChatService {
  static async answer(
    repositoryId: string,
    question: string,
  ): Promise<ChatResponse> {
    const chunks = await SearchService.search(repositoryId, question);

    const context = chunks
      .map(
        (chunk) => `File: ${chunk.filePath}
        Lines: ${chunk.startLine}-${chunk.endLine}

        ${chunk.content}`,
      )
      .join("\n\n---\n\n");

    const prompt = `
        You are an expert software engineer.

        Answer the user's question using ONLY the repository context below.

        If the answer cannot be determined from the context, say you don't know.

        Repository Context:

        ${context}

        Question:

        ${question}
    `;

    const answer = await ChatCompletionService.complete(prompt);

    const sources = new Map<
      string,
      {
        filePath: string;
        startLine: number;
        endLine: number;
      }
    >();

    for (const chunk of chunks) {
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
      answer,
      sources: [...sources.values()],
    };
  }
}
