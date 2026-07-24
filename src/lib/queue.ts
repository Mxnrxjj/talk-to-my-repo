import { Queue } from "bullmq";
import { redis } from "./redis";
import { IndexRepositoryJob } from "@/types/jobs";

export const repositoryQueue = new Queue<IndexRepositoryJob>(
  "repository-indexing",
  {
    connection: redis,
  },
);
