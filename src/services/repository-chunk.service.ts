import { db } from "@/lib/db";
import { RepositoryChunk } from "@/types/repository-chunk";
import { SearchResult } from "@/types/SearchResult";
import { Prisma } from "@prisma/client";

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

  static async searchSimilar(
    repositoryId: string,
    embedding: number[],
    limit = 5,
  ): Promise<SearchResult[]> {
    const vector = `[${embedding.join(",")}]`;

    return db.$queryRaw<SearchResult[]>(Prisma.sql`
      SELECT
        id,
        "filePath",
        content,
        "startLine",
        "endLine",
        1 - (embedding <=> CAST(${vector} AS vector)) AS similarity
      FROM "RepositoryChunk"
      WHERE
        "repositoryId" = ${repositoryId}
        AND embedding IS NOT NULL
      ORDER BY
        CASE
          WHEN "filePath" LIKE '%.ts' THEN 0
          WHEN "filePath" LIKE '%.tsx' THEN 0
          WHEN "filePath" LIKE '%.js' THEN 1
          WHEN "filePath" LIKE '%.jsx' THEN 1
          WHEN "filePath" LIKE '%.md' THEN 2
          WHEN "filePath" LIKE '%.prisma' THEN 3
          ELSE 4
        END,
      embedding <=> CAST(${vector} AS vector)
      LIMIT ${limit}
    `);
  }
}
