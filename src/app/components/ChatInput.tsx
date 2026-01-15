import React, { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-border bg-background"
    >
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напишите сообщение..."
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-muted border border-input rounded-xl px-4 py-3 text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring disabled:opacity-50 disabled:cursor-not-allowed max-h-40 overflow-y-auto leading-relaxed"
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-lg bg-foreground text-background inline-flex items-center justify-center hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:opacity-30 disabled:active:scale-100 transition-all"
          >
            <Send className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </form>
  );
}
