import path from "node:path";

import { RepositoryFileService } from "@/services/repository-file.service";
import { RepositoryIndexContext } from "@/types/RepositoryIndexContext";

export async function persistRepositoryFiles(context: RepositoryIndexContext) {
  console.log("Persisting repository files...");

  await RepositoryFileService.replaceForRepository(
    context.repository.id,
    context.files.map((file) => ({
      path: path.relative(context.clonePath, file.path),
      content: file.content,
    })),
  );

  console.log(`Persisted ${context.files.length} files`);
}
