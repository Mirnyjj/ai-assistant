import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 md:gap-4 py-6 px-4 md:px-6 bg-muted/30">
      <div className="shrink-0">
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-sm flex items-center justify-center bg-primary text-primary-foreground">
          <Bot className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-sm md:text-base">AI Ассистент</span>
        </div>
        <div className="flex gap-1">
          <span
            className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></span>
          <span
            className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></span>
          <span
            className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></span>
        </div>
      </div>
    </div>
  );
}
