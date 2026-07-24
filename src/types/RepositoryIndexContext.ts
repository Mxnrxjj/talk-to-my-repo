import { Repository } from "@prisma/client";
import { RepositoryFile } from "./repository-file";

export interface RepositoryIndexContext {
  repository: Repository;

  clonePath: string;

  // Parse stage
  files: RepositoryFile[];

  // Chunk stage

  // Embedding stage
}
