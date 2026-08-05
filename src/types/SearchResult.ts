export interface SearchResult {
  id: string;
  filePath: string;
  content: string;
  startLine: number;
  endLine: number;
  similarity: number;
}
