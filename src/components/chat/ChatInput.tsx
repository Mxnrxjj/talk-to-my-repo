"use client";

import * as React from "react";
import { Loader2, SendHorizontal } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Ask anything about this repository...",
  className,
}: ChatInputProps) {
  const [value, setValue] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const isDisabled = disabled || isSending;
  const canSend = value.trim().length > 0 && !isDisabled;

  const autoResize = React.useCallback(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, []);

  React.useEffect(() => {
    autoResize();
  }, [value, autoResize]);

  async function handleSend() {
    const message = value.trim();

    if (!message || isDisabled) {
      return;
    }

    setIsSending(true);

    try {
      await onSend(message);

      setValue("");

      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  }

  return (
    <div
      className={cn(
        "flex w-full items-end gap-2 rounded-xl border border-input bg-background p-1 shadow-sm",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1",
        className,
      )}
    >
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isDisabled}
        rows={1}
        className={cn(
          "min-h-[40px] max-h-[200px] flex-1 resize-none border-0 shadow-none",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
        )}
      />

      <Button
        type="button"
        size="icon"
        onClick={() => void handleSend()}
        disabled={!canSend}
        aria-label="Send message"
        className="shrink-0"
      >
        {isSending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <SendHorizontal className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
