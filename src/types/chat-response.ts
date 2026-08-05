export interface ChatSource {
  filePath: string;
  startLine: number;
  endLine: number;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}
