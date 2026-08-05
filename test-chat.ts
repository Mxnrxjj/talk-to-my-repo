import "dotenv/config";

import { ChatService } from "./src/services/chat.service";

async function main() {
  const response = await ChatService.answer(
    "cmsg1hk8a0006m4ksqgdchv8t",
    "How does repository cloning work?",
  );

  console.log("Answer:\n");
  console.log(response.answer);

  console.log("\nSources:\n");
  for (const source of response.sources) {
    console.log(`- ${source.filePath} (${source.startLine}-${source.endLine})`);
  }
}

main().catch(console.error);
