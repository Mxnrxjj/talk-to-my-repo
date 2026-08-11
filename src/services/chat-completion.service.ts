import { GoogleGenAI } from "@google/genai";
import { RateLimitError } from "@/lib/errors/rate-limit-error";

const MODEL = "gemini-flash-latest";

interface ChatCompletionResponse {
  answer: string;
  sources: number[];
}

export class ChatCompletionService {
  static async complete(prompt: string): Promise<ChatCompletionResponse> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        config: {
          responseMimeType: "application/json",
          systemInstruction: `
          You are an expert software engineer.

          Answer ONLY using the provided repository context.

          At the END of your response, append exactly:

          <<<SOURCES>>>
          [index1,index2,...]

          Example:

          Cleanup is performed in GitService.remove.

          <<<SOURCES>>>
          [2]

          Rules:

          - The answer must be plain Markdown.
          - Do NOT wrap the answer in JSON.
          - Do NOT explain the source list.
          - Only output <<<SOURCES>>> once.
          - Only include indices that exist in the repository context.
          `,
        },
        contents: prompt,
      });

      const text = response.text;

      if (!text) {
        throw new Error("Gemini returned an empty response.");
      }

      return JSON.parse(text) as ChatCompletionResponse;
    } catch (error: any) {
      const message = error?.message ?? "";

      if (
        message.includes("RESOURCE_EXHAUSTED") ||
        message.includes("429") ||
        message.toLowerCase().includes("quota")
      ) {
        throw new RateLimitError();
      }

      throw error;
    }
  }

  static async stream(prompt: string) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
      return await ai.models.generateContentStream({
        model: MODEL,
        config: {
          systemInstruction: `
        You are an expert software engineer.

        Answer ONLY using the provided repository context.

        Use markdown.

        At the VERY END of your response append exactly:

        <<<SOURCES>>>
        [0,2]

        Rules:

        - The answer comes FIRST.
        - The delimiter <<<SOURCES>>> appears EXACTLY ONCE.
        - After the delimiter output ONLY a JSON array of source indices.
        - Do not explain the array.
        - Do not wrap anything in markdown fences.
        - Only reference indices that exist in the provided repository context.
        `,
        },
        contents: prompt,
      });
    } catch (error: any) {
      const message = error?.message ?? "";

      if (
        message.includes("RESOURCE_EXHAUSTED") ||
        message.includes("429") ||
        message.toLowerCase().includes("quota")
      ) {
        throw new RateLimitError();
      }

      throw error;
    }
  }
}
