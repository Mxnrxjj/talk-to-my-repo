"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getRepositories } from "@/api/repositories";
import { Repository } from "@/types/repository";
import RepositoryCard from "./RepositoryCard";
import AddRepositoryDialog from "./AddRepositoryDialog";
import DeleteRepositoryDialog from "./DeleteRepositoryDialog";

interface RepositoryListProps {
  repositories: Repository[];
}

const POLL_INTERVAL_MS = 3000;

const IN_PROGRESS_STATUSES = new Set([
  "QUEUED",
  "CLONING",
  "PARSING",
  "CHUNKING",
  "EMBEDDING",
]);

export default function RepositoryList({
  repositories: initialRepositories,
}: RepositoryListProps) {
  const router = useRouter();

  const [repositories, setRepositories] =
    useState<Repository[]>(initialRepositories);
  const [pendingDelete, setPendingDelete] = useState<Repository | null>(null);

  const statusFingerprint = repositories.map((r) => r.status).join(",");

  useEffect(() => {
    const hasInProgress = repositories.some((repository) =>
      IN_PROGRESS_STATUSES.has(repository.status),
    );

    if (!hasInProgress) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const latest = await getRepositories();
        setRepositories(latest);
      } catch (error) {
        console.error("Failed to refresh repositories", error);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
    // Re-evaluate whether polling is still needed whenever statuses change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFingerprint]);

  function handleOpen(repositoryId: string) {
    router.push(`/workspace/${repositoryId}`);
  }

  function handleCreated(repository: Repository) {
    setRepositories((current) => [repository, ...current]);
  }

  function handleDeleted(repositoryId: string) {
    setRepositories((current) =>
      current.filter((repository) => repository.id !== repositoryId),
    );
    setPendingDelete(null);
  }

  if (repositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center">
        <h3 className="text-xl font-semibold tracking-tight">
          Understand any codebase.
        </h3>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Connect a public GitHub repository and start asking questions about
          the code.
        </p>

        <div className="mt-6">
          <AddRepositoryDialog onCreated={handleCreated} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <AddRepositoryDialog onCreated={handleCreated} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {repositories.map((repository) => (
          <RepositoryCard
            key={repository.id}
            repository={repository}
            onOpen={handleOpen}
            onDelete={setPendingDelete}
          />
        ))}
      </div>

      <DeleteRepositoryDialog
        repository={pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        onDeleted={handleDeleted}
      />
    </div>
  );
}
