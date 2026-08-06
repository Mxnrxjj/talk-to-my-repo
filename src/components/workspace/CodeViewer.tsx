"use client";

import { useEffect, useState } from "react";
import { Check, Copy, X } from "lucide-react";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getCodeLanguage } from "@/lib/code-language";

import { getRepositoryFile } from "@/api/repositories";

interface Props {
  repositoryId: string;
  file: {
    path: string;
    startLine: number;
    endLine: number;
  } | null;
  onClose: () => void;
}

export default function CodeViewer({ repositoryId, file, onClose }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setContent("");
      setError(null);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(null);

    getRepositoryFile(repositoryId, file.path)
      .then((f) => {
        if (cancelled) return;
        setContent(f.content);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Failed to load file.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [repositoryId, file]);

  if (!file) {
    return null;
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(content);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <div className="flex h-full min-h-0 flex-col border-l bg-background">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {file.path.split("/").pop()}
          </p>

          <p className="text-xs text-muted-foreground">{file.path}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading…</p>
        ) : error ? (
          <p className="p-6 text-sm text-destructive">{error}</p>
        ) : (
          <SyntaxHighlighter
            language={getCodeLanguage(file.path)}
            style={oneDark}
            showLineNumbers
            wrapLongLines
            customStyle={{
              margin: 0,
              padding: "1.5rem",
              background: "transparent",
              fontSize: "0.875rem",
              minHeight: "100%",
            }}
            lineNumberStyle={{
              minWidth: "2.5rem",
              paddingRight: "1rem",
              color: "#6b7280",
              userSelect: "none",
            }}
            lineProps={(lineNumber) => ({
              style: {
                display: "block",
                backgroundColor:
                  lineNumber >= file.startLine && lineNumber <= file.endLine
                    ? "rgba(250,204,21,0.12)"
                    : "transparent",
              },
            })}
          >
            {content}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
}
