"use client";
import { useState, useEffect, useRef } from "react";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessage } from "./components/ChatMessage";
import { ChatInput } from "./components/ChatInput";
import { TypingIndicator } from "./components/TypingIndicator";
import { EmptyState } from "./components/EmptyState";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function formatText(text: string): string {
  let formatted = text;

  formatted = formatted.replace(/\n(\|.+\|\n)+/g, (match) => {
    const rows = match.trim().split("\n");
    let html = '<table class="min-w-full border-collapse my-4 text-sm">';
    let isHeader = true;

    rows.forEach((row) => {
      if (row.match(/^\|[\s:-]+\|/)) {
        isHeader = false;
        return;
      }

      const cells = row.split("|").filter((c) => c.trim());
      const tag = isHeader ? "th" : "td";
      const rowClass = isHeader ? "bg-gray-100 dark:bg-gray-700" : "";

      html += `<tr class="${rowClass}">`;
      cells.forEach((cell) => {
        html += `<${tag} class="border border-gray-300 dark:border-gray-600 px-3 py-2">${cell.trim()}</${tag}>`;
      });
      html += "</tr>";

      if (isHeader) isHeader = false;
    });

    html += "</table>";
    return html;
  });

  formatted = formatted.replace(
    /^#### (.*$)/gim,
    '<h4 class="text-base font-bold mt-4 mb-2">$1</h4>',
  );
  formatted = formatted.replace(
    /^### (.*$)/gim,
    '<h3 class="text-lg font-bold mt-6 mb-3">$1</h3>',
  );
  formatted = formatted.replace(
    /^## (.*$)/gim,
    '<h2 class="text-xl font-bold mt-8 mb-4">$1</h2>',
  );
  formatted = formatted.replace(
    /^# (.*$)/gim,
    '<h1 class="text-2xl font-bold mt-10 mb-5">$1</h1>',
  );

  formatted = formatted.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-semibold">$1</strong>',
  );

  formatted = formatted.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, "<em>$1</em>");

  formatted = formatted.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>',
  );

  formatted = formatted.replace(
    /^(\d+)\.\s+(.+)$/gim,
    '<li class="ml-6">$2</li>',
  );

  formatted = formatted.replace(
    /(<li class="ml-6">.*?<\/li>\n?)+/g,
    (match) => {
      return `<ol class="my-2 list-decimal list-inside space-y-1">${match}</ol>`;
    },
  );

  formatted = formatted.replace(/^[-•]\s+(.+)$/gim, '<li class="ml-6">$1</li>');

  formatted = formatted.replace(
    /(<li class="ml-6">.*?<\/li>\n?)+/g,
    (match) => {
      if (!match.includes("list-decimal")) {
        return `<ul class="my-2 list-disc list-inside space-y-1">${match}</ul>`;
      }
      return match;
    },
  );

  formatted = formatted.replace(
    /^---+$/gim,
    '<hr class="my-4 border-gray-300 dark:border-gray-600" />',
  );

  formatted = formatted.replace(/\n\n/g, "<br /><br />");

  formatted = formatted.replace(/\n(?!<)/g, "<br />");

  return formatted;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [partialResponse, setPartialResponse] = useState("");
  const [isDark, setIsDark] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, partialResponse]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setPartialResponse("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");

        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonStr = line.slice(6).trim();
              if (!jsonStr) continue;

              const data = JSON.parse(jsonStr);

              if (data.done) {
                const assistantMessage: Message = {
                  id: (Date.now() + 1).toString(),
                  role: "assistant",
                  content: data.fullText,
                  timestamp: new Date(),
                };
                // setMessages((prev) => [...prev, assistantMessage]);
                setMessages((prev) => [...prev, assistantMessage]);
                setIsStreaming(false);
                setPartialResponse("");
              } else if (data.fullText) {
                setPartialResponse(data.fullText);
              }
            } catch (e) {
              console.error("Parse error:", e, "Line:", line);
            }
          }
        }
      }

      if (buffer.trim() && buffer.startsWith("data: ")) {
        try {
          const jsonStr = buffer.slice(6).trim();
          const data = JSON.parse(jsonStr);

          if (data.done) {
            const assistantMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: data.fullText,
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
          }
        } catch (e) {
          console.error("Final buffer parse error:", e);
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setIsStreaming(false);
      setPartialResponse("");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <ChatHeader isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />

      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 && !partialResponse ? (
          <EmptyState onSuggest={handleSendMessage} />
        ) : (
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}

            {isStreaming && partialResponse && (
              <div className="px-4 py-6">
                <div className="p-6 rounded-2xl bg-liner-to-r from-purple-400/20 dark:from-purple-600/20 border border-purple-300/50 dark:border-purple-500/50 shadow-xl">
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: formatText(partialResponse),
                    }}
                  />
                </div>
              </div>
            )}

            {isStreaming && !partialResponse && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <ChatInput onSend={handleSendMessage} disabled={isStreaming} />
    </div>
  );
}
