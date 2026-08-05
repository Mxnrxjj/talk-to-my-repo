import { GoogleGenAI } from "@google/genai";

const MODEL = "gemini-flash-latest";

export class ChatCompletionService {
  static async complete(prompt: string): Promise<string> {
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
        systemInstruction:
          "You are an expert software engineer. Answer only using the provided repository context. If the answer isn't in the context, say you don't know.",
      },
      contents: prompt,
    });

    const text = response.text;

    if (!text) {
      throw new Error("Gemini returned an empty response.");
    }

    return text;
  }
}
