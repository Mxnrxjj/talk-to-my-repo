import os from "node:os";
import path from "node:path";

import { RepositoryStatus } from "@prisma/client";
import { Job } from "bullmq";

import { RepositoryService } from "@/services/repository.service";
import { GitService } from "@/services/git.service";
import { IndexRepositoryJob } from "@/types/jobs";
import { RepositoryIndexContext } from "../src/types/RepositoryIndexContext";
import { cloneRepository } from "./pipeline/clone";
import { parseRepository } from "./pipeline/parse";

export async function processRepository(job: Job<IndexRepositoryJob>) {
  console.log("=================================");
  console.log("Processing Repository Job");
  console.log("Job ID:", job.id);
  console.log("Repository ID:", job.data.repositoryId);

  const repository = await RepositoryService.getById(job.data.repositoryId);

  if (!repository) {
    throw new Error(`Repository ${job.data.repositoryId} not found`);
  }

  const clonePath = path.join(os.tmpdir(), "talk-to-my-repo", repository.id);

  const context: RepositoryIndexContext = {
    repository,
    clonePath,
    files: [],
  };

  try {
    console.log(`Cloning into: ${clonePath}`);

    await cloneRepository(context);
    await parseRepository(context);

    await RepositoryService.updateStatus(repository.id, RepositoryStatus.READY);

    console.log("Repository indexed successfully");
  } catch (error) {
    await RepositoryService.updateStatus(
      repository.id,
      RepositoryStatus.FAILED,
    );

    throw error;
  } finally {
    await GitService.remove(context);
  }

  console.log("=================================");
}
