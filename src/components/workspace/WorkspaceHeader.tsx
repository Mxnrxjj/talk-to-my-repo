"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Repository } from "@/types/repository";
import { Button } from "@/components/ui/button";

interface WorkspaceHeaderProps {
  repository: Repository;
}

const STATUS = {
  READY: {
    label: "Ready",
    color: "bg-emerald-500",
  },
  CLONING: {
    label: "Cloning",
    color: "bg-yellow-500",
  },
  PARSING: {
    label: "Parsing",
    color: "bg-orange-500",
  },
  CHUNKING: {
    label: "Chunking",
    color: "bg-purple-500",
  },
  EMBEDDING: {
    label: "Embedding",
    color: "bg-blue-500",
  },
  QUEUED: {
    label: "Queued",
    color: "bg-zinc-400",
  },
  FAILED: {
    label: "Failed",
    color: "bg-red-500",
  },
} satisfies Record<
  Repository["status"],
  {
    label: string;
    color: string;
  }
>;

export default function WorkspaceHeader({ repository }: WorkspaceHeaderProps) {
  const { theme, setTheme } = useTheme();

  const status = STATUS[repository.status];

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-lg font-semibold">{repository.name}</h1>

          <p className="text-sm text-muted-foreground">
            {repository.githubUrl}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${status.color}`} />

            <span className="text-sm text-muted-foreground">
              {status.label}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
