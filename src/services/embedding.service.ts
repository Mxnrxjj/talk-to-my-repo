const VOYAGE_API_URL = "https://api.voyageai.com/v1/embeddings";
const EMBEDDING_MODEL = "voyage-code-3";

type EmbeddingInputType = "document" | "query";

interface VoyageEmbeddingResponse {
  data: {
    embedding: number[];
    index: number;
  }[];
}

export class EmbeddingService {
  static async embed(
    text: string,
    inputType: EmbeddingInputType = "document",
  ): Promise<number[]> {
    const apiKey = process.env.VOYAGE_API_KEY;

    if (!apiKey) {
      throw new Error("VOYAGE_API_KEY is not configured");
    }

    const response = await fetch(VOYAGE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: [text],
        model: EMBEDDING_MODEL,
        input_type: inputType,
        output_dimension: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.text();

      throw new Error(
        `Voyage embedding request failed: ${response.status} ${error}`,
      );
    }

    const data = (await response.json()) as VoyageEmbeddingResponse;

    return data.data[0].embedding;
  }

  static async embedMany(
    texts: string[],
    inputType: EmbeddingInputType = "document",
  ): Promise<number[][]> {
    const apiKey = process.env.VOYAGE_API_KEY;

    if (!apiKey) {
      throw new Error("VOYAGE_API_KEY is not configured");
    }

    if (texts.length === 0) {
      return [];
    }

    if (texts.some((text) => text.trim().length === 0)) {
      throw new Error("embedMany received an empty text.");
    }

    const response = await fetch(VOYAGE_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: texts,
        model: EMBEDDING_MODEL,
        input_type: inputType,
        output_dimension: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.text();

      throw new Error(
        `Voyage embedding request failed: ${response.status} ${error}`,
      );
    }

    const data = (await response.json()) as VoyageEmbeddingResponse;

    return data.data
      .sort((a, b) => a.index - b.index)
      .map((item) => item.embedding);
  }
}
