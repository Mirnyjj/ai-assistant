import { MessageSquare, Sparkles, Zap, Shield } from "lucide-react";

interface EmptyStateProps {
  onSuggest: (message: string) => void;
}

export function EmptyState({ onSuggest }: EmptyStateProps) {
  const suggestions = [
    { icon: Sparkles, text: "Объясни квантовую физику простыми словами" },
    { icon: Zap, text: "Помоги составить план на день" },
    { icon: Shield, text: "Расскажи о кибербезопасности" },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-2xl w-full space-y-8 md:space-y-12">
        <div className="text-center space-y-3 md:space-y-4">
          <div className="inline-flex w-16 h-16 md:w-20 md:h-20 items-center justify-center rounded-2xl bg-muted">
            <MessageSquare className="w-8 h-8 md:w-10 md:h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl md:text-2xl font-semibold">Начните диалог</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto">
            Задайте вопрос или выберите один из предложенных вариантов
          </p>
        </div>

        <div className="grid gap-3 md:gap-4">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <button
                key={index}
                onClick={() => onSuggest(suggestion.text)}
                className="w-full text-left p-4 md:p-5 rounded-lg border border-border hover:border-foreground/20 hover:bg-accent/50 transition-all group"
              >
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="shrink-0 w-8 h-8 md:w-9 md:h-9 rounded-sm bg-muted flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                  </div>
                  <span className="text-sm md:text-base flex-1 pt-1">
                    {suggestion.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
