"use client";

import { ArrowRight, Check, Loader2, MoreHorizontal } from "lucide-react";

import { Repository, RepositoryStatus } from "@/types/repository";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RepositoryCardProps {
  repository: Repository;
  onOpen: (repositoryId: string) => void;
  onDelete: (repository: Repository) => void;
  className?: string;
}

const STATUS: Record<RepositoryStatus, { label: string; dot: string }> = {
  READY: { label: "Ready", dot: "bg-emerald-500" },
  CLONING: { label: "Cloning", dot: "bg-yellow-500" },
  PARSING: { label: "Parsing", dot: "bg-orange-500" },
  CHUNKING: { label: "Chunking", dot: "bg-purple-500" },
  EMBEDDING: { label: "Embedding", dot: "bg-blue-500" },
  QUEUED: { label: "Queued", dot: "bg-zinc-400" },
  FAILED: { label: "Failed", dot: "bg-red-500" },
};

// Mirrors the order pipeline stages actually run in (see worker/processor.ts).
const INDEXING_STEPS: { status: RepositoryStatus; label: string }[] = [
  { status: "CLONING", label: "Cloning repository" },
  { status: "PARSING", label: "Parsing files" },
  { status: "CHUNKING", label: "Chunking code" },
  { status: "EMBEDDING", label: "Generating embeddings" },
];

function IndexingProgress({ status }: { status: RepositoryStatus }) {
  const activeIndex = INDEXING_STEPS.findIndex(
    (step) => step.status === status,
  );

  return (
    <ul className="mt-4 space-y-1.5">
      {INDEXING_STEPS.map((step, index) => {
        const isDone = activeIndex > index;
        const isActive = index === activeIndex;

        return (
          <li
            key={step.status}
            className={cn(
              "flex items-center gap-2 text-sm",
              isActive
                ? "text-foreground"
                : isDone
                  ? "text-muted-foreground"
                  : "text-muted-foreground/50",
            )}
          >
            {isActive ? (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
            ) : isDone ? (
              <Check className="h-3.5 w-3.5 shrink-0" />
            ) : (
              <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-current" />
            )}

            {step.label}
          </li>
        );
      })}
    </ul>
  );
}

export default function RepositoryCard({
  repository,
  onOpen,
  onDelete,
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

  const isIndexing = !["READY", "FAILED"].includes(repository.status);
  const isReady = repository.status === "READY";
  const isFailed = repository.status === "FAILED";

  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border bg-card p-5 transition-colors hover:border-foreground/20",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold tracking-tight">
            {title}
          </h3>

          <p className="mt-0.5 truncate text-sm text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Repository actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={!isReady}
              onClick={() => onOpen(repository.id)}
            >
              Open Workspace
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-500"
              onClick={() => onDelete(repository)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className={cn("h-2 w-2 rounded-full", status.dot)} />
        <span className="text-sm text-muted-foreground">{status.label}</span>
        <span className="text-sm text-muted-foreground/50">·</span>
        <span className="text-sm text-muted-foreground">
          {isReady ? "Updated" : "Started"}{" "}
          {formatRelativeTime(repository.updatedAt)}
        </span>
      </div>

      {isIndexing && <IndexingProgress status={repository.status} />}

      {isFailed && (
        <p className="mt-3 text-sm text-muted-foreground">
          Indexing failed. Delete this repository and try adding it again.
        </p>
      )}

      {isReady && repository._count && (
        <p className="mt-4 text-sm text-muted-foreground">
          {repository._count.files.toLocaleString()} files ·{" "}
          {repository._count.chunks.toLocaleString()} chunks
        </p>
      )}

      <div className="mt-5 border-t pt-4">
        <button
          onClick={() => onOpen(repository.id)}
          disabled={!isReady}
          className={cn(
            "group flex items-center gap-1.5 text-sm font-medium transition",
            isReady
              ? "text-foreground hover:text-primary"
              : "cursor-not-allowed text-muted-foreground",
          )}
        >
          {isReady ? "Open Workspace" : "Processing"}

          {isReady && (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          )}
        </button>
      </div>
    </article>
  );
}
