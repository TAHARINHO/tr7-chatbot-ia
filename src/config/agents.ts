import { COMMUNITY_MANAGEMENT_PROMPT } from "@/prompts/community-management";
import { VIDEO_MOTION_PROMPT } from "@/prompts/video-motion";
import { UX_UI_DESIGN_PROMPT } from "@/prompts/ux-ui-design";
import { DEFAULT_SYSTEM_PROMPT } from "@/types/chat";

export type AgentId =
  | "general"
  | "community-management"
  | "video-motion"
  | "ux-ui-design";

export interface AgentConfig {
  id: AgentId;
  name: string;
  shortName: string;
  description: string;
  systemPrompt: string;
  accentColor: string;   // Tailwind color name
  bgColor: string;       // CSS background for avatar/header
  textColor: string;     // CSS text color
  emoji: string;         // Icon emoji
  tags: string[];
}

export const AGENTS: AgentConfig[] = [
  {
    id: "general",
    name: "Assistant Général",
    shortName: "TR7",
    description: "Assistant IA polyvalent — code, rédaction, analyse, stratégie",
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    accentColor: "violet",
    bgColor: "oklch(0.55 0.22 290)",
    textColor: "#fff",
    emoji: "✦",
    tags: ["Général", "Code", "Rédaction", "Analyse"],
  },
  {
    id: "community-management",
    name: "Community Manager",
    shortName: "CM",
    description: "Expert Branding · Copywriting · Social Media · Growth Marketing",
    systemPrompt: COMMUNITY_MANAGEMENT_PROMPT,
    accentColor: "pink",
    bgColor: "oklch(0.60 0.22 0)",
    textColor: "#fff",
    emoji: "📱",
    tags: ["Branding", "Copywriting", "Social Media", "UGC", "Growth"],
  },
  {
    id: "video-motion",
    name: "Vidéo & Motion",
    shortName: "VM",
    description: "Expert Montage · Motion Design · UGC · IA Vidéo · Remotion",
    systemPrompt: VIDEO_MOTION_PROMPT,
    accentColor: "purple",
    bgColor: "oklch(0.45 0.25 305)",
    textColor: "#fff",
    emoji: "🎬",
    tags: ["Montage", "Motion Design", "UGC", "After Effects", "Remotion"],
  },
  {
    id: "ux-ui-design",
    name: "UX/UI Designer",
    shortName: "UX",
    description: "Expert Design · Branding Visuel · Landing Page · Design System",
    systemPrompt: UX_UI_DESIGN_PROMPT,
    accentColor: "blue",
    bgColor: "oklch(0.55 0.20 245)",
    textColor: "#fff",
    emoji: "🎨",
    tags: ["UX/UI", "Branding", "Landing Page", "Infographie", "Design System"],
  },
];

export const DEFAULT_AGENT = AGENTS[0];

export function getAgent(id: AgentId): AgentConfig {
  return AGENTS.find((a) => a.id === id) ?? DEFAULT_AGENT;
}
