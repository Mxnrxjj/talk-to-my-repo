import "dotenv/config";

import { EmbeddingService } from "./src/services/embedding.service";

async function main() {
  const embeddings = await EmbeddingService.embedMany(
    [
      "function add(a: number, b: number) { return a + b; }",
      "function subtract(a: number, b: number) { return a - b; }",
      "function multiply(a: number, b: number) { return a * b; }",
    ],
    "document",
  );

  console.log("Number of embeddings:", embeddings.length);

  for (const embedding of embeddings) {
    console.log("Dimensions:", embedding.length);
  }
}

main().catch(console.error);
