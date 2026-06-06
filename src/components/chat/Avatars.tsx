"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { AgentPersona } from "@/config/agents";

interface AIAvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isActive?: boolean;
  className?: string;
  persona?: AgentPersona;
}

const SIZES = {
  xs: { outer: "h-6 w-6",  text: "text-[9px]",  icon: 10, dot: "h-1.5 w-1.5 -bottom-0 -right-0 border" },
  sm: { outer: "h-9 w-9",  text: "text-sm",   icon: 14, dot: "h-2.5 w-2.5 -bottom-0.5 -right-0.5 border-2" },
  md: { outer: "h-10 w-10", text: "text-base",  icon: 18, dot: "h-2.5 w-2.5 -bottom-0.5 -right-0.5 border-2" },
  lg: { outer: "h-14 w-14", text: "text-xl",   icon: 22, dot: "h-3 w-3 -bottom-0.5 -right-0.5 border-2" },
  xl: { outer: "h-20 w-20", text: "text-2xl",  icon: 28, dot: "h-3.5 w-3.5 -bottom-1 -right-1 border-2" },
};

export function AIAvatar({ size = "md", isActive, className, persona }: AIAvatarProps) {
  const s = SIZES[size];

  // INAYA avatar — image ou fallback premium gold
  if (persona) {
    return (
      <InayaAvatar
        persona={persona}
        size={size}
        isActive={isActive}
        className={className}
      />
    );
  }

  // Avatar générique TR7 (gradient violet)
  return (
    <div
      className={cn(
        "relative flex-shrink-0 rounded-full flex items-center justify-center select-none",
        "bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500",
        isActive && "avatar-pulse",
        s.outer,
        className
      )}
      style={{ boxShadow: "0 2px 12px oklch(0.55 0.22 290 / 30%), 0 0 0 2px white" }}
    >
      <div className="absolute inset-0 rounded-full bg-white/10" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="relative z-10 text-white"
        style={{ width: s.icon, height: s.icon }}
      >
        <path
          d="M12 2L9.5 8.5H3L8.5 12.5L6 19L12 15L18 19L15.5 12.5L21 8.5H14.5L12 2Z"
          fill="currentColor"
          opacity="0.9"
        />
      </svg>
      {isActive && (
        <span className={cn("absolute rounded-full bg-emerald-400 border-white", s.dot)} />
      )}
    </div>
  );
}

// ─── INAYA AVATAR ────────────────────────────────────────────────
interface InayaAvatarProps {
  persona: AgentPersona;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  isActive?: boolean;
  className?: string;
  showLabel?: boolean;
}

export function InayaAvatar({ persona, size = "md", isActive, className, showLabel }: InayaAvatarProps) {
  const s = SIZES[size];
  const gold = persona.accentColor ?? "#C9A84C";

  return (
    <div className={cn("relative flex-shrink-0", className)}>
      {/* Anneau gold */}
      <div
        className={cn("rounded-full p-[2px] flex-shrink-0", s.outer)}
        style={{
          background: `conic-gradient(${gold}, #8B6914, ${gold}, #F5D485, ${gold})`,
          boxShadow: `0 0 16px ${gold}55, 0 2px 8px rgba(0,0,0,0.3)`,
        }}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-[#0d0a00]">
          {persona.avatarUrl ? (
            <img
              src={persona.avatarUrl}
              alt={persona.name}
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><span style="font-size:${size === 'xl' ? 28 : size === 'lg' ? 20 : 14}px;color:${gold};font-weight:700;font-family:serif">${persona.name.charAt(0)}</span></div>`;
              }}
            />
          ) : (
            <InayaFallback persona={persona} size={size} />
          )}
        </div>
      </div>

      {/* Dot online */}
      {isActive && (
        <span
          className={cn("absolute rounded-full border-white", s.dot)}
          style={{ background: "#4ade80" }}
        />
      )}

      {/* Label optionnel */}
      {showLabel && (
        <div className="mt-1 text-center">
          <p className="text-xs font-bold" style={{ color: gold }}>{persona.name}</p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest">{persona.role}</p>
        </div>
      )}
    </div>
  );
}

// Fallback visuel INAYA — quand l'image n'est pas disponible
function InayaFallback({ persona, size }: { persona: AgentPersona; size: string }) {
  const gold = persona.accentColor ?? "#C9A84C";
  const fontSize = size === "xl" ? "1.5rem" : size === "lg" ? "1.1rem" : size === "md" ? "0.875rem" : "0.65rem";

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center select-none"
      style={{
        background: "linear-gradient(160deg, #1a1100 0%, #2d2000 40%, #1a1500 100%)",
      }}
    >
      {/* Initial stylisée */}
      <span
        style={{
          fontSize,
          fontWeight: 800,
          fontFamily: "Georgia, serif",
          background: `linear-gradient(135deg, ${gold}, #F5D485, ${gold})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "0.05em",
        }}
      >
        {persona.name.charAt(0)}
      </span>
    </div>
  );
}

// ─── INAYA WELCOME CARD (grande version) ────────────────────────
interface InayaWelcomeCardProps {
  persona: AgentPersona;
  onSuggestion: (prompt: string) => void;
}

export function InayaWelcomeCard({ persona, onSuggestion }: InayaWelcomeCardProps) {
  const gold = persona.accentColor ?? "#C9A84C";

  const suggestions = [
    { label: "Rédige un email", prompt: "Rédige un email professionnel pour présenter TR7 Agency à un nouveau client potentiel." },
    { label: "Analyse un document", prompt: "Aide-moi à analyser et synthétiser un document complexe en points clés actionnables." },
    { label: "Prépare une réunion", prompt: "Aide-moi à préparer l'ordre du jour et les questions clés pour une réunion stratégique." },
    { label: "Plan d'action", prompt: "Crée un plan d'action structuré pour lancer un nouveau projet digital en 30 jours." },
    { label: "Résumé exécutif", prompt: "Génère un résumé exécutif clair et impactant pour présenter un rapport à la direction." },
    { label: "Quel agent choisir ?", prompt: "Guide-moi : quel agent IA de TR7 est le plus adapté pour automatiser mes processus commerciaux ?" },
  ];

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto px-4 py-6 select-none">
      {/* Card principale INAYA */}
      <div
        className="relative w-full rounded-3xl overflow-hidden mb-6"
        style={{
          background: "linear-gradient(135deg, #0d0a00 0%, #1f1800 40%, #0d0a00 100%)",
          border: `1px solid ${gold}33`,
          boxShadow: `0 0 40px ${gold}22, 0 4px 32px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Reflet gold en haut */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${gold}88, transparent)` }}
        />

        <div className="flex items-center gap-6 p-6">
          {/* Avatar grande taille */}
          <InayaAvatar persona={persona} size="xl" isActive />

          {/* Texte */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h2
                className="text-2xl font-bold tracking-wide"
                style={{
                  background: `linear-gradient(135deg, ${gold}, #F5D485, ${gold})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {persona.name}
              </h2>
              <div
                className="h-5 px-2 rounded-full flex items-center text-[9px] font-bold uppercase tracking-widest flex-shrink-0"
                style={{ background: `${gold}20`, color: gold, border: `1px solid ${gold}40` }}
              >
                AI ASSISTANT
              </div>
            </div>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: `${gold}80` }}>
              TR7 Agency Studio
            </p>
            {persona.bio && (
              <p className="text-sm text-white/60 leading-relaxed">
                {persona.bio}
              </p>
            )}
          </div>
        </div>

        {/* Ligne séparatrice gold */}
        <div className="mx-6 h-px" style={{ background: `linear-gradient(90deg, transparent, ${gold}44, transparent)` }} />

        {/* Capabilities */}
        <div className="px-6 py-4 flex flex-wrap gap-2">
          {["Rédaction", "Analyse", "Documents", "Décision", "Coordination", "Stratégie"].map((cap) => (
            <span
              key={cap}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: `${gold}15`, color: `${gold}cc`, border: `1px solid ${gold}30` }}
            >
              {cap}
            </span>
          ))}
        </div>

        {/* Reflet gold en bas */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${gold}44, transparent)` }}
        />
      </div>

      {/* Message de bienvenue */}
      <p className="text-sm text-muted-foreground text-center mb-5">
        Bonjour, je suis <strong className="text-foreground">INAYA</strong>, votre AI Assistant TR7.
        Comment puis-je vous aider aujourd'hui ?
      </p>

      {/* Suggestions */}
      <div className="grid grid-cols-2 gap-2.5 w-full">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSuggestion(s.prompt)}
            className="group flex items-center gap-2.5 p-3 rounded-xl text-left transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "rgba(201, 168, 76, 0.06)",
              border: "1px solid rgba(201, 168, 76, 0.15)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(201, 168, 76, 0.12)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201, 168, 76, 0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(201, 168, 76, 0.06)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(201, 168, 76, 0.15)";
            }}
          >
            <div
              className="h-6 w-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
              style={{ background: `${gold}20`, color: gold }}
            >
              ✦
            </div>
            <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors">
              {s.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── USER AVATAR ─────────────────────────────────────────────────
interface UserAvatarProps {
  initials?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ initials = "T", size = "sm", className }: UserAvatarProps) {
  const s = SIZES[size];
  return (
    <div
      className={cn(
        "relative flex-shrink-0 rounded-full flex items-center justify-center select-none font-semibold",
        "bg-gradient-to-br from-slate-700 to-slate-900 text-white",
        s.outer, s.text,
        className
      )}
      style={{ boxShadow: "0 2px 8px oklch(0 0 0 / 15%), 0 0 0 2px white" }}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
}
