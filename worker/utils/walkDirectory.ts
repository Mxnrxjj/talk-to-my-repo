import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

import { shouldIgnoreDirectory, shouldIgnoreFile } from "./ignore";
import { RepositoryIndexContext } from "@/types/RepositoryIndexContext";

const MAX_FILE_SIZE = 500 * 1024; // 500 KB

export async function walkDirectory(
  context: RepositoryIndexContext,
  directory: string,
) {
  const entries = await readdir(directory, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      if (shouldIgnoreDirectory(entry.name)) {
        continue;
      }

      await walkDirectory(context, fullPath);
      continue;
    }

    if (shouldIgnoreFile(entry.name)) {
      continue;
    }

    const fileStats = await stat(fullPath);

    if (fileStats.size > MAX_FILE_SIZE) {
      console.log(`Skiping large file : ${fullPath}`);
      continue;
    }

    const content = await readFile(fullPath, "utf-8");

    context.files.push({
      path: fullPath,
      content,
    });
  }
}
