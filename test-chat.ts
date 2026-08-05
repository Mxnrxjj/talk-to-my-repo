import "dotenv/config";

import { ChatService } from "./src/services/chat.service";
import { db } from "@/lib/db";

async function main() {
  const chat = await db.chat.create({
    data: {
      repositoryId: "cmsg1hk8a0006m4ksqgdchv8t",
    },
  });

  console.log(
    await ChatService.answer(chat.id, "How does repository cloning work?"),
  );

  // console.log(await ChatService.answer(chat.id, "What happens after that?"));

  // console.log(
  //   await ChatService.answer(chat.id, "Where is the cleanup performed?"),
  // );
}

main().catch(console.error);
