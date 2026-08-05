import { EmbeddingService } from "./embedding.service";
import { RepositoryChunkService } from "./repository-chunk.service";

export class SearchService {
  static async search(repositoryId: string, query: string, limit = 10) {
    const embedding = await EmbeddingService.embed(query, "query");

    return RepositoryChunkService.searchSimilar(repositoryId, embedding, limit);
  }
}
