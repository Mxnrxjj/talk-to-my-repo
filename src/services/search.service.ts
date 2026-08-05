import { EmbeddingService } from "./embedding.service";
import { RepositoryChunkService } from "./repository-chunk.service";

export class SearchService {
  private static readonly SEARCH_LIMIT = 10;
  private static readonly RETURN_LIMIT = 5;
  private static readonly MIN_SIMILARITY = 0.55;

  static async search(repositoryId: string, query: string) {
    const embedding = await EmbeddingService.embed(query, "query");

    const results = await RepositoryChunkService.searchSimilar(
      repositoryId,
      embedding,
      SearchService.SEARCH_LIMIT,
    );

    const filtered = results.filter(
      (chunk) => chunk.similarity >= SearchService.MIN_SIMILARITY,
    );

    return filtered.length > 0
      ? filtered.slice(0, SearchService.RETURN_LIMIT)
      : results.slice(0, 3);
  }
}
