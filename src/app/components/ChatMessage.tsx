import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

function formatText(text: string): string {
  let formatted = text;

  formatted = formatted.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (match, lang, code) => {
      return `<pre class="bg-secondary/50 border border-border rounded-lg p-4 my-4 overflow-x-auto"><code class="text-sm font-mono text-foreground">${code.trim()}</code></pre>`;
    }
  );

  formatted = formatted.replace(/\n(\|.+\|\n)+/g, (match) => {
    const rows = match.trim().split("\n");
    const tableRows: string[] = [];
    let isHeader = true;

    rows.forEach((row) => {
      if (row.match(/^\|[\s:-]+\|/)) {
        isHeader = false;
        return;
      }

      const cells = row.split("|").filter((c) => c.trim());
      const tag = isHeader ? "th" : "td";
      const rowClass = isHeader ? "bg-muted font-semibold" : "bg-card";

      let rowHtml = `<tr class="${rowClass}">`;
      cells.forEach((cell) => {
        const content = cell.trim();
        const align = content.match(/^:.*:$/)
          ? "center"
          : content.startsWith(":")
          ? "left"
          : content.endsWith(":")
          ? "right"
          : "left";

        rowHtml += `<${tag} class="border border-border px-3 py-2 text-${align} text-foreground" style="${
          tag === "th"
            ? "white-space: nowrap;"
            : "max-width: 300px; word-wrap: break-word;"
        }">${content}</${tag}>`;
      });
      rowHtml += "</tr>";

      tableRows.push(rowHtml);
      if (isHeader) isHeader = false;
    });

    return `<div style="overflow-x: auto; max-width: 100%; margin: 1rem 0;"><table style="width: 100%; border-collapse: collapse; display: table;">${tableRows.join(
      ""
    )}</table></div>`;
  });

  // Заголовки
  formatted = formatted.replace(
    /^#### (.*$)/gim,
    '<h4 class="text-base font-bold mt-4 mb-2 text-foreground">$1</h4>'
  );
  formatted = formatted.replace(
    /^### (.*$)/gim,
    '<h3 class="text-lg font-bold mt-6 mb-3 text-foreground">$1</h3>'
  );
  formatted = formatted.replace(
    /^## (.*$)/gim,
    '<h2 class="text-xl font-bold mt-8 mb-4 text-foreground">$1</h2>'
  );
  formatted = formatted.replace(
    /^# (.*$)/gim,
    '<h1 class="text-2xl font-bold mt-10 mb-5 text-foreground">$1</h1>'
  );

  // Жирный текст
  formatted = formatted.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-semibold text-foreground">$1</strong>'
  );

  // Курсив
  formatted = formatted.replace(
    /(?<!\*)\*([^*\n]+?)\*(?!\*)/g,
    '<em class="italic text-muted-foreground">$1</em>'
  );

  // Инлайн-код
  formatted = formatted.replace(
    /`([^`]+)`/g,
    '<code class="bg-muted text-foreground px-1.5 py-0.5 rounded text-sm font-mono border border-border/50">$1</code>'
  );

  // Нумерованные списки
  formatted = formatted.replace(
    /^(\d+)\.\s+(.+)$/gim,
    '<li class="ml-6 text-foreground">$2</li>'
  );

  formatted = formatted.replace(
    /(<li class="ml-6 text-foreground">.*?<\/li>\n?)+/,
    '<ol class="my-2 list-decimal list-inside space-y-1">$&</ol>'
  );

  // Маркированные списки
  formatted = formatted.replace(
    /^[-•]\s+(.+)$/gim,
    '<li class="ml-6 text-foreground">$1</li>'
  );

  formatted = formatted.replace(
    /(<li class="ml-6 text-foreground">(?:(?!<ol>).)*?<\/li>\n?)+/,
    (match) => {
      if (match.includes("list-decimal")) return match;
      return `<ul class="my-2 list-disc list-inside space-y-1">${match}</ul>`;
    }
  );

  // Горизонтальная линия
  formatted = formatted.replace(
    /^---+$/gim,
    '<hr class="my-4 border-border" />'
  );

  // Абзацы
  formatted = formatted.replace(/\n\n/g, "<br /><br />");

  return formatted;
}

export function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex gap-3 md:gap-4 py-6 px-4 md:px-6 ${
        !isUser ? "bg-muted/30" : ""
      }`}
    >
      <div className="shrink-0">
        <div
          className={`w-8 h-8 md:w-9 md:h-9 rounded-sm flex items-center justify-center ${
            isUser
              ? "bg-foreground text-background"
              : "bg-primary text-primary-foreground"
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <Bot className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0 space-y-2 overflow-hidden">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-sm md:text-base text-foreground">
            {isUser ? "Вы" : "AI Ассистент"}
          </span>
          <span className="text-xs text-muted-foreground">
            {timestamp.toLocaleTimeString("ru-RU", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div
          className="text-sm md:text-base leading-relaxed prose prose-sm dark:prose-invert max-w-none overflow-x-hidden"
          dangerouslySetInnerHTML={{ __html: formatText(content) }}
        />
      </div>
    </div>
  );
}
