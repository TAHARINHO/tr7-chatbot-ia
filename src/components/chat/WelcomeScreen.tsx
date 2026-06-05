"use client";

import { SparklesIcon, CodeIcon, PenIcon, SearchIcon, LightbulbIcon } from "lucide-react";

const SUGGESTIONS = [
  {
    icon: <CodeIcon className="h-4 w-4" />,
    title: "Génère du code",
    prompt: "Écris-moi une fonction Python qui trie une liste d'objets par date.",
  },
  {
    icon: <PenIcon className="h-4 w-4" />,
    title: "Rédige du contenu",
    prompt: "Rédige un email professionnel pour présenter TR7 Agency à un nouveau prospect.",
  },
  {
    icon: <SearchIcon className="h-4 w-4" />,
    title: "Analyse & synthèse",
    prompt: "Explique-moi les avantages et inconvénients des architectures microservices.",
  },
  {
    icon: <LightbulbIcon className="h-4 w-4" />,
    title: "Stratégie & idées",
    prompt: "Donne-moi 5 idées innovantes pour automatiser le workflow d'une agence digitale.",
  },
];

interface WelcomeScreenProps {
  onSuggestion: (prompt: string) => void;
}

export function WelcomeScreen({ onSuggestion }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 py-12">
      {/* Hero */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div className="relative">
          <div className="h-16 w-16 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center glow-violet">
            <SparklesIcon className="h-8 w-8 text-primary" />
          </div>
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary animate-pulse" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground glow-text">
            TR7 ChatBot IA
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Propulsé par Claude · Prêt à vous assister
          </p>
        </div>
      </div>

      {/* Suggestions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(s.prompt)}
            className="group flex items-start gap-3 p-4 rounded-xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-primary/25 transition-all duration-150 text-left"
          >
            <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
              {s.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
                {s.title}
              </p>
              <p className="text-xs text-muted-foreground/50 mt-0.5 line-clamp-2">
                {s.prompt}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
