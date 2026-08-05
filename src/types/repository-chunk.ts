export interface RepositoryChunk {
  id: string;
  filePath: string;
  content: string;
  startLine: number;
  endLine: number;
}
