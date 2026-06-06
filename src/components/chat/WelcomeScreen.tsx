"use client";

import { useChatStore } from "@/store/chat-store";
import { AGENTS } from "@/config/agents";
import { AgentSelector } from "./AgentSelector";
import { CodeIcon, PenIcon, ImageIcon, LightbulbIcon, ZapIcon, TrendingUpIcon } from "lucide-react";

const GENERAL_SUGGESTIONS = [
  { icon: <CodeIcon className="h-4 w-4" />, title: "Générer du code", prompt: "Écris une fonction TypeScript qui valide un email et retourne les erreurs.", color: "bg-blue-50 text-blue-600 group-hover:bg-blue-100" },
  { icon: <PenIcon className="h-4 w-4" />, title: "Rédiger du contenu", prompt: "Rédige un email de prospection pour présenter TR7 Agency à un client.", color: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100" },
  { icon: <ImageIcon className="h-4 w-4" />, title: "Analyser une image", prompt: "Que vois-tu dans cette image ?", color: "bg-pink-50 text-pink-600 group-hover:bg-pink-100" },
  { icon: <LightbulbIcon className="h-4 w-4" />, title: "Brainstorming", prompt: "Donne-moi 5 idées innovantes pour automatiser le workflow d'une agence digitale.", color: "bg-amber-50 text-amber-600 group-hover:bg-amber-100" },
  { icon: <ZapIcon className="h-4 w-4" />, title: "Stratégie rapide", prompt: "Quelles sont les 3 meilleures stratégies pour améliorer la rétention client ?", color: "bg-violet-50 text-violet-600 group-hover:bg-violet-100" },
  { icon: <TrendingUpIcon className="h-4 w-4" />, title: "Analyse & synthèse", prompt: "Explique-moi les avantages et inconvénients des architectures microservices.", color: "bg-orange-50 text-orange-600 group-hover:bg-orange-100" },
];

const AGENT_SUGGESTIONS: Record<string, { icon: React.ReactNode; title: string; prompt: string; color: string }[]> = {
  "community-management": [
    { icon: <PenIcon className="h-4 w-4" />, title: "Stratégie Social Media", prompt: "Crée une stratégie social media complète pour une agence digitale spécialisée en IA.", color: "bg-pink-50 text-pink-600 group-hover:bg-pink-100" },
    { icon: <ZapIcon className="h-4 w-4" />, title: "Hooks viraux", prompt: "Génère 5 hooks ultra-percutants pour TikTok sur le thème de l'automatisation IA.", color: "bg-rose-50 text-rose-600 group-hover:bg-rose-100" },
    { icon: <ImageIcon className="h-4 w-4" />, title: "Caption Instagram", prompt: "Écris 3 versions d'une caption Instagram pour le lancement d'un produit SaaS.", color: "bg-orange-50 text-orange-600 group-hover:bg-orange-100" },
    { icon: <TrendingUpIcon className="h-4 w-4" />, title: "Calendrier éditorial", prompt: "Crée un calendrier éditorial sur 4 semaines pour Instagram et LinkedIn.", color: "bg-amber-50 text-amber-600 group-hover:bg-amber-100" },
  ],
  "video-motion": [
    { icon: <ZapIcon className="h-4 w-4" />, title: "Script vidéo TikTok", prompt: "Écris un script complet pour un TikTok de 30 secondes présentant un outil IA.", color: "bg-purple-50 text-purple-600 group-hover:bg-purple-100" },
    { icon: <CodeIcon className="h-4 w-4" />, title: "Template Remotion", prompt: "Crée un template Remotion pour une vidéo de présentation de produit SaaS.", color: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100" },
    { icon: <ImageIcon className="h-4 w-4" />, title: "Storyboard UGC", prompt: "Crée un storyboard pour une vidéo UGC 'problème → solution' pour une app mobile.", color: "bg-violet-50 text-violet-600 group-hover:bg-violet-100" },
    { icon: <TrendingUpIcon className="h-4 w-4" />, title: "Prompt IA vidéo", prompt: "Donne-moi un prompt détaillé pour Runway pour générer une scène de présentation de produit tech.", color: "bg-pink-50 text-pink-600 group-hover:bg-pink-100" },
  ],
  "ux-ui-design": [
    { icon: <LightbulbIcon className="h-4 w-4" />, title: "Identité visuelle", prompt: "Crée une identité visuelle complète pour une agence digitale spécialisée en IA et automation.", color: "bg-blue-50 text-blue-600 group-hover:bg-blue-100" },
    { icon: <ImageIcon className="h-4 w-4" />, title: "Landing page", prompt: "Structure une landing page convertissante pour un outil SaaS de productivité IA.", color: "bg-sky-50 text-sky-600 group-hover:bg-sky-100" },
    { icon: <CodeIcon className="h-4 w-4" />, title: "Design System", prompt: "Définis les composants UI essentiels pour un design system d'une app IA B2B.", color: "bg-teal-50 text-teal-600 group-hover:bg-teal-100" },
    { icon: <ZapIcon className="h-4 w-4" />, title: "Palette de couleurs", prompt: "Propose 3 palettes de couleurs pour une marque tech premium orientée confiance et innovation.", color: "bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100" },
  ],
};

interface WelcomeScreenProps {
  onSuggestion: (prompt: string) => void;
}

export function WelcomeScreen({ onSuggestion }: WelcomeScreenProps) {
  const { selectedAgentId } = useChatStore();
  const agent = AGENTS.find((a) => a.id === selectedAgentId) ?? AGENTS[0];
  const suggestions = selectedAgentId === "general"
    ? GENERAL_SUGGESTIONS
    : (AGENT_SUGGESTIONS[selectedAgentId] ?? GENERAL_SUGGESTIONS);

  return (
    <div className="flex flex-col items-center justify-start min-h-[calc(100vh-180px)] px-6 py-8 select-none">

      {/* Hero Agent */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <div
          className="h-16 w-16 rounded-2xl flex items-center justify-center text-3xl shadow-md"
          style={{ background: agent.bgColor }}
        >
          {agent.emoji}
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {agent.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
            {agent.description}
          </p>
        </div>
        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-2 max-w-sm">
          {agent.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: `${agent.bgColor}18`, color: agent.bgColor }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl mb-8">
        {suggestions.map((s, i) => (
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
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{s.prompt}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Séparateur + sélecteur d'agents */}
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-border" />
          <p className="text-xs text-muted-foreground font-medium flex-shrink-0">Changer d'agent</p>
          <div className="flex-1 h-px bg-border" />
        </div>
        <AgentSelector onSelect={() => {}} />
      </div>
    </div>
  );
}
