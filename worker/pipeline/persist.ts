import { RepositoryChunkService } from "@/services/repository-chunk.service";
import { RepositoryIndexContext } from "@/types/RepositoryIndexContext";

export async function persistRepository(context: RepositoryIndexContext) {
  console.log("Persisting repository chunks...");

  await RepositoryChunkService.replaceForRepository(
    context.repository.id,
    context.chunks,
  );

  console.log(`Persisted ${context.chunks.length} chunks`);
}
