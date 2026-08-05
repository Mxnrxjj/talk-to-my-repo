export class ChatTitleService {
  static fromQuestion(question: string): string {
    const STOP_WORDS = new Set([
      "how",
      "what",
      "where",
      "why",
      "when",
      "who",
      "does",
      "do",
      "is",
      "are",
      "can",
      "could",
      "would",
      "should",
      "will",
      "the",
      "a",
      "an",
      "about",
      "explain",
      "tell",
      "me",
    ]);

    return question
      .replace(/[?.!]/g, "")
      .split(/\s+/)
      .filter((word) => !STOP_WORDS.has(word.toLowerCase()))
      .slice(0, 4)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
