import { SearchService } from "@/services/search.service";
import { ChatCompletionService } from "@/services/chat-completion.service";
import { ChatResponse } from "@/types/chat";
import { db } from "@/lib/db";
import { NotFoundError } from "@/lib/errors/not-found-error";
import { ChatTitleService } from "./chat-title.service";

export class ChatService {
  static async getByRepository(repositoryId: string) {
    return db.chat.findMany({
      where: {
        repositoryId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            sources: true,
          },
        },
      },
    });
  }

  static async create(repositoryId: string) {
    return db.chat.create({
      data: {
        repositoryId,
        title: "New Conversation",
      },
    });
  }

  static async get(chatId: string) {
    return db.chat.findUnique({
      where: {
        id: chatId,
      },
      include: {
        messages: {
          include: {
            sources: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  static async rename(chatId: string, title: string) {
    return db.chat.update({
      where: {
        id: chatId,
      },
      data: {
        title,
      },
    });
  }

  static async delete(chatId: string) {
    return db.chat.delete({
      where: {
        id: chatId,
      },
    });
  }

  static async answer(chatId: string, question: string): Promise<ChatResponse> {
    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      throw new NotFoundError(`Chat ${chatId} not found`);
    }

    const shouldGenerateTitle = chat.title === "New Conversation";

    const [messages, chunks] = await Promise.all([
      db.chatMessage.findMany({
        where: {
          chatId,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      SearchService.search(chat.repositoryId, question),
    ]);

    const context = chunks
      .map(
        (chunk, index) => `
        [${index}]

        File: ${chunk.filePath}

        Lines: ${chunk.startLine}-${chunk.endLine}

        ${chunk.content}
        `,
      )
      .join("\n\n---\n\n");

    const history = [
      ...messages,
      {
        role: "user",
        content: question,
      },
    ]
      .map(
        (message) =>
          `${message.role === "user" ? "User" : "Assistant"}:\n\n${message.content}`,
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

    await db.chatMessage.create({
      data: {
        chatId,
        role: "user",
        content: question,
      },
    });

    const completion = await ChatCompletionService.complete(prompt);

    const title = shouldGenerateTitle
      ? ChatTitleService.fromQuestion(question)
      : null;

    const sources = completion.sources
      .map((index) => chunks[index])
      .filter(Boolean)
      .map((chunk) => ({
        filePath: chunk.filePath,
        startLine: chunk.startLine,
        endLine: chunk.endLine,
      }));

    // const sources = new Map<
    //   string,
    //   {
    //     filePath: string;
    //     startLine: number;
    //     endLine: number;
    //   }
    // >();

    // for (const chunk of chunks) {
    //   const existing = sources.get(chunk.filePath);

    //   if (!existing) {
    //     sources.set(chunk.filePath, {
    //       filePath: chunk.filePath,
    //       startLine: chunk.startLine,
    //       endLine: chunk.endLine,
    //     });
    //     continue;
    //   }

    //   existing.startLine = Math.min(existing.startLine, chunk.startLine);
    //   existing.endLine = Math.max(existing.endLine, chunk.endLine);
    // }

    await db.$transaction([
      ...(title
        ? [
            db.chat.update({
              where: {
                id: chatId,
              },
              data: {
                title,
              },
            }),
          ]
        : []),

      db.chatMessage.create({
        data: {
          chatId,
          role: "assistant",
          content: completion.answer,
          sources: {
            create: sources,
          },
        },
      }),
    ]);

    return {
      answer: completion.answer,
      sources,
    };
  }

  static async prepare(chatId: string, question: string) {
    const chat = await db.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      throw new NotFoundError(`Chat ${chatId} not found`);
    }

    const shouldGenerateTitle = chat.title === "New Conversation";

    const [messages, chunks] = await Promise.all([
      db.chatMessage.findMany({
        where: {
          chatId,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      SearchService.search(chat.repositoryId, question),
    ]);

    const context = chunks
      .map(
        (chunk) => `
File: ${chunk.filePath}

Lines: ${chunk.startLine}-${chunk.endLine}

${chunk.content}
`,
      )
      .join("\n\n---\n\n");

    const history = [
      ...messages,
      {
        role: "user",
        content: question,
      },
    ]
      .map(
        (message) =>
          `${message.role === "user" ? "User" : "Assistant"}:\n\n${message.content}`,
      )
      .join("\n\n");

    const prompt = `
You are an expert software engineer.

Conversation History:

${history}

Repository Context:

${context}

Question:

${question}
`;

    await db.chatMessage.create({
      data: {
        chatId,
        role: "user",
        content: question,
      },
    });

    return {
      prompt,
      chunks,
      chatId,
      shouldGenerateTitle,
      title: shouldGenerateTitle
        ? ChatTitleService.fromQuestion(question)
        : null,
    };
  }

  static async saveAssistant(
    chatId: string,
    answer: string,
    selectedChunks: any[],
    title: string | null,
  ) {
    const sources = selectedChunks.map((chunk) => ({
      filePath: chunk.filePath,
      startLine: chunk.startLine,
      endLine: chunk.endLine,
    }));

    await db.$transaction([
      ...(title
        ? [
            db.chat.update({
              where: {
                id: chatId,
              },
              data: {
                title,
              },
            }),
          ]
        : []),

      db.chatMessage.create({
        data: {
          chatId,
          role: "assistant",
          content: answer,
          sources: {
            create: sources,
          },
        },
      }),
    ]);
  }
}
