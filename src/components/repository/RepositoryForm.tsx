"use client";

import { createRepository } from "@/api/repositories";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RepositoryForm() {
  const [githubUrl, setGithubUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!githubUrl.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createRepository({
        githubUrl,
      });

      setGithubUrl("");
      router.refresh();
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="url"
        value={githubUrl}
        onChange={(e) => setGithubUrl(e.target.value)}
        placeholder="https://github.com/owner/repo"
        className="flex-1 rounded border px-3 py-2"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded border px-4 py-2 hover:cursor-pointer disabled:opacity-50"
      >
        {isSubmitting ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
