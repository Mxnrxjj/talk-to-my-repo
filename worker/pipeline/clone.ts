import { RepositoryStatus } from "@prisma/client";

import { GitService } from "@/services/git.service";
import { RepositoryService } from "@/services/repository.service";
import { RepositoryIndexContext } from "@/types/RepositoryIndexContext";

export async function cloneRepository(context: RepositoryIndexContext) {
  await RepositoryService.updateStatus(
    context.repository.id,
    RepositoryStatus.CLONING,
  );

  await GitService.clone(context);
}
