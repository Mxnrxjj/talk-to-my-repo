import path from "node:path";

import { RepositoryIndexContext } from "@/types/RepositoryIndexContext";
import { randomUUID } from "node:crypto";

const CHUNK_SIZE = 50;
const CHUNK_OVERLAP = 10;
const MIN_CHUNK_SIZE = 10;

export async function chunkRepository(context: RepositoryIndexContext) {
  console.log("Chunking repository...");

  for (const file of context.files) {
    const lines = file.content.split("\n");

    const relativePath = path.relative(context.clonePath, file.path);

    for (
      let start = 0;
      start < lines.length;
      start += CHUNK_SIZE - CHUNK_OVERLAP
    ) {
      const end = Math.min(start + CHUNK_SIZE, lines.length);

      const chunkLines = lines.slice(start, end);

      if (chunkLines.length < MIN_CHUNK_SIZE && lines.length > CHUNK_SIZE) {
        continue;
      }

      const content = chunkLines.join("\n");

      context.chunks.push({
        id: randomUUID(),
        filePath: relativePath,
        content,
        startLine: start + 1,
        endLine: end,
      });
    }
  }

  console.log(`Created ${context.chunks.length} chunks`);
}
