"use client";

import { useRouter } from "next/navigation";

import { Repository } from "@/types/repository";
import RepositoryCard from "./RepositoryCard";

interface RepositoryListProps {
  repositories: Repository[];
}

export default function RepositoryList({ repositories }: RepositoryListProps) {
  const router = useRouter();

  function handleOpen(repositoryId: string) {
    router.push(`/workspace/${repositoryId}`);
  }

  if (repositories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
        <h3 className="text-lg font-semibold">No repositories yet</h3>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Index your first GitHub repository to start chatting with your
          codebase.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y rounded-2xl border">
      {repositories.map((repository) => (
        <RepositoryCard
          key={repository.id}
          repository={repository}
          onOpen={handleOpen}
        />
      ))}
    </div>
  );
}
