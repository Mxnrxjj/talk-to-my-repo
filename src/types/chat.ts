export type ChatRole = "user" | "assistant";

export interface ChatRequest {
  question: string;
}

export interface ChatSource {
  filePath: string;
  startLine: number;
  endLine: number;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
}
