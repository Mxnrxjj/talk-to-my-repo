"use client";

import { ArrowRight } from "lucide-react";

import { Repository } from "@/types/repository";
import { cn } from "@/lib/utils";

interface RepositoryCardProps {
  repository: Repository;
  onOpen: (repositoryId: string) => void;
  className?: string;
}

const STATUS = {
  READY: {
    label: "Ready",
    dot: "bg-emerald-500",
  },
  CLONING: {
    label: "Cloning",
    dot: "bg-yellow-500",
  },
  PARSING: {
    label: "Parsing",
    dot: "bg-orange-500",
  },
  CHUNKING: {
    label: "Chunking",
    dot: "bg-purple-500",
  },
  EMBEDDING: {
    label: "Embedding",
    dot: "bg-blue-500",
  },
  QUEUED: {
    label: "Queued",
    dot: "bg-zinc-400",
  },
  FAILED: {
    label: "Failed",
    dot: "bg-red-500",
  },
} satisfies Record<
  Repository["status"],
  {
    label: string;
    dot: string;
  }
>;

export default function RepositoryCard({
  repository,
  onOpen,
  className,
}: RepositoryCardProps) {
  const status = STATUS[repository.status];

  const title =
    repository.name ||
    repository.githubUrl.split("/").pop() ||
    "Unknown Repository";

  const subtitle = repository.owner
    ? `${repository.owner}/${repository.name}`
    : repository.githubUrl;

  return (
    <article
      className={cn(
        "group flex items-center justify-between px-6 py-6 transition-colors hover:bg-muted/40",
        className,
      )}
    >
      <div className="min-w-0">
        <h3 className="truncate text-lg font-semibold tracking-tight">
          {title}
        </h3>

        <p className="mt-1 truncate text-sm text-muted-foreground">
          {subtitle}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", status.dot)} />

          <span className="text-sm text-muted-foreground">{status.label}</span>
        </div>
      </div>

      <button
        onClick={() => onOpen(repository.id)}
        disabled={repository.status !== "READY"}
        className={cn(
          "flex items-center gap-2 text-sm font-medium transition",
          repository.status === "READY"
            ? "text-foreground hover:text-primary"
            : "cursor-not-allowed text-muted-foreground",
        )}
      >
        {repository.status === "READY" ? "Open Workspace" : "Processing"}

        {repository.status === "READY" && (
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        )}
      </button>
    </article>
  );
}
