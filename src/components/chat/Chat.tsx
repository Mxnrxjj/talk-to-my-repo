"use client";

import { useRouter } from "next/navigation";

import ChatInput from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

import { sendMessage } from "@/api/chats";
import { ChatResponse } from "@/types/chat";
import { ChatSource } from "@/types/chat";

interface ChatProps {
  chatId: string;
  messages: {
    id: string;
    role: string;
    content: string;
    sources: ChatSource[];
  }[];
}

export default function Chat({ chatId, messages }: ChatProps) {
  const router = useRouter();

  async function handleSend(question: string) {
    await sendMessage(chatId, {
      question,
    });

    router.refresh();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl px-8 py-12 gap-6 flex flex-col">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role as "user" | "assistant"}
              content={message.content}
              sources={message.sources}
            />
          ))}
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
