import "dotenv/config";
import { SearchService } from "@/services/search.service";

async function main() {
  const results = await SearchService.search(
    "cmsg1hk8a0006m4ksqgdchv8t",
    "How are repository chunks persisted?",
  );

  console.log(results);
}

main();
