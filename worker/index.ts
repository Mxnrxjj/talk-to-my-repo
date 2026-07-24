import { Worker } from "bullmq";
import { redis } from "../src/lib/redis";
import { processRepository } from "./processor";

const worker = new Worker("repository-indexing", processRepository, {
  connection: redis,
});

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
  console.error(`❌ Job ${job?.id} failed`);
  console.error(error);
});

console.log("Worker started...");
