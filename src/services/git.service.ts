import { access, rm } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { RepositoryIndexContext } from "../types/RepositoryIndexContext";

const execFileAsync = promisify(execFile);

export class GitService {
  static async clone(context: RepositoryIndexContext) {
    console.log(`Cloning ${context.repository.githubUrl}`);

    await execFileAsync("git", [
      "clone",
      "--depth",
      "1",
      context.repository.githubUrl,
      context.clonePath,
    ]);

    await access(path.join(context.clonePath, ".git"));

    console.log("✅ Repository cloned");
  }

  static async remove(context: RepositoryIndexContext) {
    await rm(context.clonePath, {
      recursive: true,
      force: true,
    });

    console.log("Repository cleaned up");
  }
}
