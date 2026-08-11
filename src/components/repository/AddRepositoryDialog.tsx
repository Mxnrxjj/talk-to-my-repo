"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { createRepository } from "@/api/repositories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Repository } from "@/types/repository";

interface AddRepositoryDialogProps {
  onCreated: (repository: Repository) => void;
}

export default function AddRepositoryDialog({
  onCreated,
}: AddRepositoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!githubUrl.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const repository = await createRepository({ githubUrl });

      toast.success("Repository indexing started.");

      onCreated(repository);
      setGithubUrl("");
      setOpen(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isSubmitting) {
          setOpen(nextOpen);
        }
      }}
    >
      <DialogTrigger
        render={
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            Add Repository
          </Button>
        }
      />

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add repository</DialogTitle>
          <DialogDescription>
            Connect a public GitHub repository to start asking questions about
            its code.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-2">
          <label
            htmlFor="githubUrl"
            className="text-xs font-medium text-muted-foreground"
          >
            GitHub repository URL
          </label>

          <Input
            id="githubUrl"
            type="url"
            autoFocus
            placeholder="https://github.com/vercel/next.js"
            value={githubUrl}
            onChange={(event) => setGithubUrl(event.target.value)}
            disabled={isSubmitting}
          />

          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || !githubUrl.trim()}
              className="gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding
                </>
              ) : (
                <>
                  Add Repository
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
