"use client";

import ReactMarkdown from "react-markdown";
import { Sparkles, User, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChatSource } from "@/types/chat";

export interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
  onSourceClick?: (path: string, startLine: number, endLine: number) => void;
}

export function ChatMessage({
  role,
  content,
  sources,
  onSourceClick,
}: ChatMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div className={cn("flex gap-3", !isAssistant && "flex-row-reverse")}>
      {/* Avatar */}

      {/* <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-zinc-600",
          isAssistant ? "bg-black" : "bg-white",
        )}
      >
        {isAssistant ? (
          <Sparkles className="h-4 w-4 text-white" />
        ) : (
          <User className="h-4 w-4 text-black" />
        )}
      </div> */}

      {/* Bubble */}
      <div
        className={cn(
          "flex max-w-2xl flex-col rounded-xl border px-4 py-3",
          isAssistant
            ? "border-zinc-800 bg-zinc-900/60"
            : "border-zinc-800 bg-black",
        )}
      >
        <div
          className={cn(
            "text-sm leading-relaxed text-zinc-200",
            "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
            "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
            "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
            "[&_li]:my-1",
            "[&_h1]:mt-3 [&_h1]:mb-2 [&_h1]:text-base [&_h1]:font-semibold [&_h1]:text-zinc-100",
            "[&_h2]:mt-3 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-zinc-100",
            "[&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-zinc-100",
            "[&_strong]:font-semibold [&_strong]:text-zinc-100",
            "[&_a]:text-blue-400 [&_a]:underline [&_a]:underline-offset-2",
            "[&_code]:rounded [&_code]:bg-zinc-800 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_code]:text-blue-300",
            "[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-zinc-800 [&_pre]:bg-zinc-950 [&_pre]:p-3",
            "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
            "[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-zinc-700 [&_blockquote]:pl-3 [&_blockquote]:text-zinc-400",
          )}
        >
          {content === "Thinking..." ? (
            <div className="flex items-center gap-2 text-white/80">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-white/80" />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-white/80"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-white/80"
                  style={{ animationDelay: "300ms" }}
                />
              </div>

              <span>Thinking...</span>
            </div>
          ) : (
            <ReactMarkdown>{content}</ReactMarkdown>
          )}
        </div>

        {/* Source chips */}
        {sources && sources.length > 0 && (
          <div className="mt-3 border-t border-zinc-800 pt-3">
            <div className="mb-2 text-[11px] font-medium tracking-wide text-white/80">
              SOURCES & LINE REFERENCES ({sources.length})
            </div>
            <div className="flex flex-wrap gap-2">
              {sources.map((source) => {
                const parts = source.filePath.replaceAll("\\", "/").split("/");

                const fileName = parts.pop()!;
                const folder = parts.join("/");
                return (
                  <button
                    key={`${source.filePath}-${source.startLine}`}
                    className="flex items-center hover:bg-zinc-800 gap-1.5 rounded-md border border-zinc-700 bg-zinc-800/60 px-2.5 py-1 text-xs text-zinc-300"
                    onClick={() =>
                      onSourceClick?.(
                        source.filePath,
                        source.startLine,
                        source.endLine,
                      )
                    }
                  >
                    <FileCode2 className="h-3.5 w-3.5 text-zinc-500" />

                    <div className="flex flex-col items-start">
                      <p className="font-medium">{fileName}</p>
                      <p className="text-xs text-muted-foreground">{folder}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
