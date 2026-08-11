"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createRepository } from "@/api/repositories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RepositoryForm() {
  const [githubUrl, setGithubUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!githubUrl.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const repository = await createRepository({
        githubUrl,
      });

      toast.success("Repository indexing started.");

      setGithubUrl("");

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex h-14 items-center rounded-2xl border border-border bg-background px-2 shadow-sm transition-all focus-within:border-primary">
        <Input
          type="url"
          placeholder="https://github.com/vercel/next.js"
          value={githubUrl}
          onChange={(event) => setGithubUrl(event.target.value)}
          disabled={isSubmitting}
          className="h-full border-0 bg-transparent shadow-none focus-visible:ring-0"
        />

        <Button
          type="submit"
          disabled={isSubmitting || !githubUrl.trim()}
          className="rounded-xl px-5"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Indexing
            </>
          ) : (
            <>
              Try TalkToMyRepo
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Supports any public GitHub repository.
      </p>
    </form>
  );
}
