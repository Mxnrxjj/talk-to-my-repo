import { repositoryQueue } from "@/lib/queue";

async function main() {
  console.log("Waiting:", await repositoryQueue.getWaitingCount());
  console.log("Active:", await repositoryQueue.getActiveCount());
  console.log("Delayed:", await repositoryQueue.getDelayedCount());
  console.log("Failed:", await repositoryQueue.getFailedCount());

  process.exit(0);
}

main();
