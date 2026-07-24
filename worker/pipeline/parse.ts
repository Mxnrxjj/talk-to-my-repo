import { RepositoryIndexContext } from "@/types/RepositoryIndexContext";
import { walkDirectory } from "../utils/walkDirectory";

export async function parseRepository(context: RepositoryIndexContext) {
  console.log("Parsing repository...");

  await walkDirectory(context, context.clonePath);

  console.log(`Parsed ${context.files.length} files`);
}
