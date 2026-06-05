"use client";

import { CodeIcon, PenIcon, ImageIcon, LightbulbIcon, FileTextIcon, ZapIcon } from "lucide-react";
import { AIAvatar } from "./Avatars";

const SUGGESTIONS = [
  {
    icon: <CodeIcon className="h-4 w-4" />,
    title: "Générer du code",
    prompt: "Écris une fonction TypeScript qui valide un email et retourne les erreurs.",
    color: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
  },
  {
    icon: <PenIcon className="h-4 w-4" />,
    title: "Rédiger du contenu",
    prompt: "Rédige un email de prospection pour présenter TR7 Agency à un client.",
    color: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
  },
  {
    icon: <ImageIcon className="h-4 w-4" />,
    title: "Analyser une image",
    prompt: "Que vois-tu dans cette image ?",
    color: "bg-pink-50 text-pink-600 group-hover:bg-pink-100",
  },
  {
    icon: <LightbulbIcon className="h-4 w-4" />,
    title: "Brainstorming",
    prompt: "Donne-moi 5 idées innovantes pour automatiser le workflow d'une agence digitale.",
    color: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
  },
  {
    icon: <FileTextIcon className="h-4 w-4" />,
    title: "Résumer un document",
    prompt: "Résume ce document en 5 points clés.",
    color: "bg-violet-50 text-violet-600 group-hover:bg-violet-100",
  },
  {
    icon: <ZapIcon className="h-4 w-4" />,
    title: "Stratégie rapide",
    prompt: "Quelles sont les 3 meilleures stratégies pour améliorer la rétention client ?",
    color: "bg-orange-50 text-orange-600 group-hover:bg-orange-100",
  },
];

interface WelcomeScreenProps {
  onSuggestion: (prompt: string) => void;
}

export function WelcomeScreen({ onSuggestion }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-180px)] px-6 py-12 select-none">
      {/* Hero */}
      <div className="flex flex-col items-center gap-5 mb-10">
        <AIAvatar size="lg" isActive />
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight gradient-text">
            TR7 ChatBot IA
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs text-center">
            Propulsé par Claude · Analysez des images, des documents, et bien plus encore
          </p>
        </div>

        {/* Capability pills */}
        <div className="flex flex-wrap justify-center gap-2 max-w-sm">
          {["Vision IA", "Documents", "Code", "Streaming", "Multimodal"].map((pill) => (
            <span
              key={pill}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white border border-border text-muted-foreground shadow-sm"
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* Suggestions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full max-w-2xl">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(s.prompt)}
            className="group flex items-start gap-3 p-4 rounded-2xl border border-border bg-white hover:shadow-card-hover transition-all duration-200 text-left hover:-translate-y-0.5"
          >
            <div className={`flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center transition-colors ${s.color}`}>
              {s.icon}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{s.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                {s.prompt}
              </p>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/40 mt-8 text-center">
        Glissez-déposez une image ou un fichier dans la zone de texte pour l'analyser
      </p>
    </div>
  );
}
