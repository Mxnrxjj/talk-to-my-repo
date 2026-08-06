"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import ChatInput from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

import { sendMessage } from "@/api/chats";
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
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  async function handleSend(question: string) {
    try {
      setPendingQuestion(question);
      setLoading(true);

      await sendMessage(chatId, {
        question,
      });

      router.refresh();
    } finally {
      setPendingQuestion(null);
      setLoading(false);
    }
  }

  const optimisticMessages = [
    ...messages,
    ...(pendingQuestion
      ? [
          {
            id: "pending-user",
            role: "user",
            content: pendingQuestion,
            sources: [],
          },
        ]
      : []),
    ...(loading
      ? [
          {
            id: "pending-assistant",
            role: "assistant",
            content: "Thinking...",
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
  }, [optimisticMessages]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-8 py-12">
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
                    // onClick={() => handleSend(example)}
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
