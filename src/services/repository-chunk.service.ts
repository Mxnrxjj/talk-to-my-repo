import { db } from "@/lib/db";
import { RepositoryChunk } from "@/types/repository-chunk";

export class RepositoryChunkService {
  static async replaceForRepository(
    repositoryId: string,
    chunks: RepositoryChunk[],
  ) {
    return db.$transaction(async (tx) => {
      await tx.repositoryChunk.deleteMany({
        where: {
          repositoryId,
        },
      });

      await tx.repositoryChunk.createMany({
        data: chunks.map((chunk) => ({
          id: chunk.id,
          repositoryId,
          filePath: chunk.filePath,
          content: chunk.content,
          startLine: chunk.startLine,
          endLine: chunk.endLine,
        })),
      });
    });
  }

  static async updateEmbedding(chunkId: string, embedding: number[]) {
    const vector = `[${embedding.join(",")}]`;

    await db.$executeRaw`
    UPDATE "RepositoryChunk"
    SET "embedding" = ${vector}::vector
    WHERE "id" = ${chunkId}
  `;
  }
}
