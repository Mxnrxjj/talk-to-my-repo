import { Repository } from "@prisma/client";
import { RepositoryFile } from "./repository-file";
import { RepositoryChunk } from "./repository-chunk";

export interface RepositoryIndexContext {
  repository: Repository;

  clonePath: string;

  // Parse stage
  files: RepositoryFile[];

  // Chunk stage
  chunks: RepositoryChunk[];

  // Embedding stage
}
