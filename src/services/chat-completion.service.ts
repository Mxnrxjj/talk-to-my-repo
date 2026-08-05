import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-flash-latest";

interface ChatCompletionResponse {
  answer: string;
  sources: string[];
}

export class ChatCompletionService {
  static async complete(prompt: string): Promise<ChatCompletionResponse> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const response = await ai.models.generateContent({
      model: MODEL,
      config: {
        responseMimeType: "application/json",
        systemInstruction: `
          You are an expert software engineer.

          Answer ONLY using the provided repository context.

          Return valid JSON in exactly this format:

          {
            "answer": "your answer",
            "sources": [
              "path/to/file1",
              "path/to/file2"
            ]
          }

          Only include file paths that directly support your answer.
          Do not invent file paths.
        `,
      },
      contents: prompt,
    });

    const text = response.text;
    console.log(text);

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return JSON.parse(text) as ChatCompletionResponse;
  }
}
