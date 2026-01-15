import { Menu, Moon, Sun } from "lucide-react";

interface ChatHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onMenuClick?: () => void;
}

export function ChatHeader({
  isDark,
  onToggleTheme,
  onMenuClick,
}: ChatHeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="md:hidden w-8 h-8 flex items-center justify-center hover:bg-accent rounded transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-base md:text-lg font-semibold">AI Ассистент</h1>
            <p className="text-xs text-muted-foreground hidden md:block">
              Интеллектуальный помощник Сеня
            </p>
          </div>
        </div>
        <button
          onClick={onToggleTheme}
          className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center hover:bg-accent rounded transition-colors"
          aria-label="Переключить тему"
        >
          {isDark ? (
            <Sun className="w-4 h-4 md:w-5 md:h-5" />
          ) : (
            <Moon className="w-4 h-4 md:w-5 md:h-5" />
          )}
        </button>
      </div>
    </header>
  );
}
