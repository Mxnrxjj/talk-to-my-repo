"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { deleteRepository } from "@/api/repositories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Repository } from "@/types/repository";

interface DeleteRepositoryDialogProps {
  repository: Repository | null;
  onOpenChange: (open: boolean) => void;
  onDeleted: (repositoryId: string) => void;
}

export default function DeleteRepositoryDialog({
  repository,
  onOpenChange,
  onDeleted,
}: DeleteRepositoryDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!repository) return;

    setIsDeleting(true);

    try {
      await deleteRepository(repository.id);

      toast.success("Repository deleted.");

      onDeleted(repository.id);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  const title =
    repository?.name ||
    repository?.githubUrl.split("/").pop() ||
    "this repository";

  return (
    <Dialog
      open={repository !== null}
      onOpenChange={(nextOpen) => {
        if (!isDeleting) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete repository</DialogTitle>
          <DialogDescription>
            This permanently deletes{" "}
            <span className="font-medium text-foreground">{title}</span> along
            with its indexed files, chunks and conversations. This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
            className="gap-1.5"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting
              </>
            ) : (
              "Delete Repository"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
