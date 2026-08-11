export class RateLimitError extends Error {
  constructor() {
    super("Daily Gemini API limit exceeded.");
    this.name = "RateLimitError";
  }
}
