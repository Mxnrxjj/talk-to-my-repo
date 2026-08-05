import { EmbeddingService } from "@/services/embedding.service";
import { RepositoryIndexContext } from "@/types/RepositoryIndexContext";
import { RepositoryChunkService } from "@/services/repository-chunk.service";

// TODO: Batch based on estimated token count instead of a fixed chunk count.
const EMBEDDING_BATCH_SIZE = 40;

export async function embedRepository(context: RepositoryIndexContext) {
  console.log("Embedding repository chunks...");

  for (
    let start = 0;
    start < context.chunks.length;
    start += EMBEDDING_BATCH_SIZE
  ) {
    const batch = context.chunks.slice(start, start + EMBEDDING_BATCH_SIZE);

    const validChunks = batch.filter(
      (chunk) => chunk.content.trim().length > 0,
    );

    if (validChunks.length === 0) {
      continue;
    }

    const emptyChunks = batch.filter(
      (chunk) => chunk.content.trim().length === 0,
    );

    if (emptyChunks.length > 0) {
      console.warn(`Skipped ${emptyChunks.length} empty chunks`);
    }

    const texts = validChunks.map((chunk) => chunk.content);

    const embeddings = await EmbeddingService.embedMany(texts, "document");

    if (embeddings.length !== validChunks.length) {
      throw new Error(
        `Embedding count mismatch: expected ${validChunks.length}, received ${embeddings.length}`,
      );
    }

    await Promise.all(
      validChunks.map((chunk, index) =>
        RepositoryChunkService.updateEmbedding(chunk.id, embeddings[index]),
      ),
    );

    const processed = Math.min(
      start + validChunks.length,
      context.chunks.length,
    );

    console.log(`Embedded ${processed}/${context.chunks.length} chunks`);
  }

  console.log("Repository embeddings generated");
}
