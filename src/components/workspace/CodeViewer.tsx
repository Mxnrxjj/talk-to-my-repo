"use client";

import { useEffect, useState } from "react";
import { getRepositoryFile } from "@/api/repositories";

interface Props {
  repositoryId: string;
  file: {
    path: string;
    startLine: number;
    endLine: number;
  } | null;
}

export default function CodeViewer({ repositoryId, file }: Props) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!file) return;

    getRepositoryFile(repositoryId, file.path).then((f) => {
      console.log(f);
      setContent(f.content);
    });
  }, [repositoryId, file]);

  if (!file) {
    return (
      <div className="flex h-full items-center justify-center text-zinc-500">
        Select a source to view its code.
      </div>
    );
  }

  return (
    <pre className="h-full overflow-auto p-6 font-mono text-sm leading-6">
      {content.split("\n").map((line, index) => (
        <div
          key={index}
          className={
            file && index + 1 >= file.startLine && index + 1 <= file.endLine
              ? "bg-yellow-500/10"
              : ""
          }
        >
          <span className="mr-6 inline-block w-10 select-none text-right text-zinc-500">
            {index + 1}
          </span>

          <span>{line || " "}</span>
        </div>
      ))}
    </pre>
  );
}
