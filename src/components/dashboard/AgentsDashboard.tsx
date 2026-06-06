"use client";

import { AGENTS, AGENT_CATEGORIES, AgentCategory, AgentConfig } from "@/config/agents";
import { InayaAvatar } from "@/components/chat/Avatars";
import Link from "next/link";
import { SparklesIcon } from "lucide-react";

const CATEGORY_ORDER: AgentCategory[] = ["general", "management", "contenu", "business", "technique", "rh"];

export function AgentsDashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <SparklesIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">TR7 ChatBot IA</h1>
              <p className="text-xs text-muted-foreground">Choisissez votre agent</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-muted-foreground">{AGENTS.length} agents actifs</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">Votre équipe d'agents IA</h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Sélectionnez un agent pour démarrer une conversation spécialisée.
            Chaque agent est expert dans son domaine.
          </p>
        </div>

        {/* Grille par catégorie */}
        {CATEGORY_ORDER.map((cat) => {
          const catAgents = AGENTS.filter((a) => a.category === cat);
          if (!catAgents.length) return null;
          const catInfo = AGENT_CATEGORIES[cat];

          return (
            <div key={cat} className="mb-10">
              {/* Titre catégorie */}
              <div className="flex items-center gap-3 mb-4">
                <h3 className={`text-sm font-bold uppercase tracking-wider ${catInfo.color}`}>
                  {catInfo.label}
                </h3>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">{catAgents.length} agent{catAgents.length > 1 ? "s" : ""}</span>
              </div>

              {/* Cards agents */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {catAgents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgentCard({ agent }: { agent: AgentConfig }) {
  const isInaya = !!agent.persona;
  const gold = agent.persona?.accentColor ?? "#C9A84C";

  return (
    <Link
      href={`/agent/${agent.id}`}
      className="group block"
    >
      <div
        className={`
          relative rounded-2xl border p-4 h-full transition-all duration-200
          ${isInaya
            ? "border-transparent hover:shadow-xl hover:-translate-y-1"
            : "bg-white border-border hover:shadow-card-hover hover:-translate-y-0.5"
          }
        `}
        style={isInaya ? {
          background: "linear-gradient(135deg, #0d0a00 0%, #1f1800 50%, #0d0a00 100%)",
          border: `1px solid ${gold}44`,
          boxShadow: `0 4px 24px ${gold}22`,
        } : {}}
      >
        {/* Reflet gold top pour INAYA */}
        {isInaya && (
          <div
            className="absolute top-0 left-4 right-4 h-px rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${gold}88, transparent)` }}
          />
        )}

        {/* Avatar + infos */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          {isInaya && agent.persona ? (
            <InayaAvatar persona={agent.persona} size="md" />
          ) : (
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm transition-transform group-hover:scale-105"
              style={{ background: agent.bgColor }}
            >
              {agent.emoji}
            </div>
          )}

          {/* Texte */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-1">
              <p
                className="text-sm font-bold leading-tight"
                style={isInaya ? {
                  background: `linear-gradient(135deg, ${gold}, #F5D485)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                } : { color: "var(--foreground)" }}
              >
                {isInaya ? agent.persona?.name : agent.name}
              </p>
            </div>
            {isInaya && agent.persona && (
              <p className="text-[9px] uppercase tracking-widest mb-1" style={{ color: `${gold}80` }}>
                {agent.persona.role}
              </p>
            )}
            <p className={`text-xs leading-relaxed line-clamp-2 ${isInaya ? "text-white/50" : "text-muted-foreground"}`}>
              {isInaya ? agent.persona?.bio : agent.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {agent.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[9px] px-1.5 py-0.5 rounded-full"
              style={isInaya ? {
                background: `${gold}15`,
                color: `${gold}cc`,
                border: `1px solid ${gold}25`,
              } : {
                background: `${agent.bgColor}15`,
                color: agent.bgColor,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bouton CTA */}
        <div
          className={`
            mt-3 w-full rounded-xl py-2 text-center text-xs font-semibold transition-all duration-200
            ${isInaya
              ? "opacity-0 group-hover:opacity-100"
              : "bg-accent text-foreground group-hover:bg-primary/10 group-hover:text-primary"
            }
          `}
          style={isInaya ? {
            background: `linear-gradient(135deg, ${gold}33, ${gold}55)`,
            color: gold,
            border: `1px solid ${gold}44`,
          } : {}}
        >
          {isInaya ? `Parler à ${agent.persona?.name}` : "Démarrer →"}
        </div>

        {/* Reflet gold bottom pour INAYA */}
        {isInaya && (
          <div
            className="absolute bottom-0 left-4 right-4 h-px rounded-full"
            style={{ background: `linear-gradient(90deg, transparent, ${gold}44, transparent)` }}
          />
        )}
      </div>
    </Link>
  );
}
