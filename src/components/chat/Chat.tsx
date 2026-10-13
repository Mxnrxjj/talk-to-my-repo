"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ChatInput from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

import { sendMessageStream } from "@/api/chats";
import { ChatSource } from "@/types/chat";

interface ChatProps {
  chatId: string;
  messages: {
    id: string;
    role: string;
    content: string;
    sources: ChatSource[];
  }[];
  onSourceClick: (path: string, startLine: number, endLine: number) => void;
}

export default function Chat({ chatId, messages, onSourceClick }: ChatProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [isRefreshing, startRefresh] = useTransition();
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);
  const [failure, setFailure] = useState<{ question: string } | null>(null);
  const [streamingAnswer, setStreamingAnswer] = useState("");

  async function handleSend(question: string) {
    try {
      setFailure(null);
      setPendingQuestion(question);
      setStreamingAnswer("");
      setLoading(true);

      const reader = await sendMessageStream(chatId, {
        question,
      });

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        setStreamingAnswer(
          (prev) => prev + decoder.decode(value, { stream: true }),
        );
      }

      startRefresh(() => {
        router.refresh();
      });
    } catch (error) {
      setStreamingAnswer("");
      // Keep the user's question on screen and show a failed reply under it.
      setFailure({ question });

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  const showPending = loading || isRefreshing;

  const optimisticMessages = [
    ...messages,
    ...(pendingQuestion && (showPending || failure)
      ? [
          {
            id: "pending-user",
            role: "user",
            content: pendingQuestion,
            sources: [],
          },
        ]
      : []),
    ...(showPending
      ? [
          {
            id: "pending-assistant",
            role: "assistant",
            content: streamingAnswer || "Thinking...",
            sources: [],
          },
        ]
      : []),
  ];

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [optimisticMessages.length, streamingAnswer, failure]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-8 py-12">
          {messages.length === 0 && !loading && !pendingQuestion ? (
            <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
              <div className="mb-6 text-6xl">🤖</div>

              <h1 className="mb-2 text-3xl font-bold">Talk to My Repo</h1>

              <p className="mb-8 max-w-lg text-muted-foreground">
                Ask anything about this repository. I'll search the codebase,
                understand the implementation, and answer with source
                references.
              </p>

              <div className="flex w-full max-w-xl flex-col gap-3">
                {[
                  "How does repository cloning work?",
                  "Explain the indexing pipeline.",
                  "Where is GitService used?",
                ].map((example) => (
                  <button
                    key={example}
                    onClick={() => handleSend(example)}
                    className="rounded-xl border px-4 py-3 text-left text-sm transition hover:bg-muted"
                  >
                    ✨ {example}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {optimisticMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  role={message.role as "user" | "assistant"}
                  content={message.content}
                  sources={message.sources}
                  onSourceClick={onSourceClick}
                />
              ))}
              {failure && !loading && (
                <div className="flex gap-3">
                  <div className="flex max-w-2xl flex-col gap-2 rounded-xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                    <p>Answer generation failed. Please try again.</p>

                    <button
                      type="button"
                      onClick={() => handleSend(failure.question)}
                      className="self-start rounded-md border border-red-800 px-3 py-1 text-xs transition hover:bg-red-900/40"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </>
          )}
        </div>
      </div>

      <div className="sticky bottom-0 border-t bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl p-6">
          <ChatInput onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
