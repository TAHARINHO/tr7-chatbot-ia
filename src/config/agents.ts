import { DEFAULT_SYSTEM_PROMPT } from "@/types/chat";
import { COMMUNITY_MANAGEMENT_PROMPT } from "@/prompts/community-management";
import { VIDEO_MOTION_PROMPT } from "@/prompts/video-motion";
import { UX_UI_DESIGN_PROMPT } from "@/prompts/ux-ui-design";
import { ORCHESTRATEUR_PROMPT } from "@/prompts/orchestrateur";
import { RH_PROMPT } from "@/prompts/ressources-humaines";
import { RECRUTEMENT_PROMPT } from "@/prompts/recrutement";
import { DOCUMENTAIRE_PROMPT } from "@/prompts/documentaire";
import { MARKETING_DIGITAL_PROMPT } from "@/prompts/marketing-digital";
import { FINANCE_PROMPT } from "@/prompts/finance";
import { DEVOPS_PROMPT } from "@/prompts/devops";
import { DEVELOPPEMENT_LOGICIEL_PROMPT } from "@/prompts/developpement-logiciel";
import { DATA_ANALYSIS_PROMPT } from "@/prompts/data-analysis";
import { CYBERSECURITE_PROMPT } from "@/prompts/cybersecurite";
import { CRM_PROMPT } from "@/prompts/crm";
import { SURVEILLANCE_DECISION_PROMPT } from "@/prompts/surveillance-decision";
import { PROCESS_AUTOMATION_PROMPT } from "@/prompts/process-automation";
import { MULTI_AGENT_SUPERVISOR_PROMPT } from "@/prompts/multi-agent-supervisor";
import { ASSISTANT_GENERAL_PROMPT } from "@/prompts/assistant-general";

export type AgentId =
  | "general"
  | "assistant-general"
  | "orchestrateur"
  | "multi-agent-supervisor"
  | "community-management"
  | "video-motion"
  | "ux-ui-design"
  | "marketing-digital"
  | "crm"
  | "finance"
  | "surveillance-decision"
  | "devops"
  | "developpement-logiciel"
  | "data-analysis"
  | "cybersecurite"
  | "process-automation"
  | "ressources-humaines"
  | "recrutement"
  | "documentaire";

export type AgentCategory = "general" | "management" | "contenu" | "business" | "technique" | "rh";

export interface AgentConfig {
  id: AgentId;
  name: string;
  shortName: string;
  description: string;
  systemPrompt: string;
  bgColor: string;
  emoji: string;
  tags: string[];
  category: AgentCategory;
}

export const AGENT_CATEGORIES: Record<AgentCategory, { label: string; color: string }> = {
  general:    { label: "Général",      color: "text-violet-600" },
  management: { label: "Management IA", color: "text-amber-600" },
  contenu:    { label: "Contenu & Design", color: "text-pink-600" },
  business:   { label: "Business",     color: "text-emerald-600" },
  technique:  { label: "Technique",    color: "text-blue-600" },
  rh:         { label: "RH",           color: "text-rose-600" },
};

export const AGENTS: AgentConfig[] = [
  // ─── GÉNÉRAL ───
  {
    id: "general",
    name: "Assistant TR7",
    shortName: "TR7",
    description: "Assistant IA polyvalent — code, rédaction, analyse, stratégie",
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    bgColor: "oklch(0.55 0.22 290)",
    emoji: "✦",
    tags: ["Général", "Code", "Rédaction", "Analyse"],
    category: "general",
  },
  {
    id: "assistant-general",
    name: "AI Assistant",
    shortName: "AI",
    description: "Copilot d'entreprise — productivité, documents, coordination agents",
    systemPrompt: ASSISTANT_GENERAL_PROMPT,
    bgColor: "oklch(0.50 0.20 270)",
    emoji: "🤖",
    tags: ["Productivité", "Documents", "Coordination", "Copilot"],
    category: "general",
  },

  // ─── MANAGEMENT IA ───
  {
    id: "orchestrateur",
    name: "Orchestrateur IA",
    shortName: "ORC",
    description: "Chef d'orchestre multi-agents — coordination, fusion de résultats, workflows",
    systemPrompt: ORCHESTRATEUR_PROMPT,
    bgColor: "oklch(0.58 0.20 35)",
    emoji: "🎯",
    tags: ["Orchestration", "Multi-agents", "Workflows", "CRM", "Reporting"],
    category: "management",
  },
  {
    id: "multi-agent-supervisor",
    name: "Supervisor IA",
    shortName: "SUP",
    description: "Supervision globale — gouvernance IA, qualité, erreurs, charge",
    systemPrompt: MULTI_AGENT_SUPERVISOR_PROMPT,
    bgColor: "oklch(0.35 0.05 250)",
    emoji: "👔",
    tags: ["Supervision", "Gouvernance IA", "Qualité", "Erreurs", "Charge"],
    category: "management",
  },

  // ─── CONTENU & DESIGN ───
  {
    id: "community-management",
    name: "Community Manager",
    shortName: "CM",
    description: "Branding · Copywriting · Social Media · Growth Marketing",
    systemPrompt: COMMUNITY_MANAGEMENT_PROMPT,
    bgColor: "oklch(0.60 0.22 0)",
    emoji: "📱",
    tags: ["Branding", "Copywriting", "Social Media", "UGC", "Growth"],
    category: "contenu",
  },
  {
    id: "video-motion",
    name: "Vidéo & Motion",
    shortName: "VM",
    description: "Montage · Motion Design · UGC · IA Vidéo · Remotion",
    systemPrompt: VIDEO_MOTION_PROMPT,
    bgColor: "oklch(0.45 0.25 305)",
    emoji: "🎬",
    tags: ["Montage", "Motion Design", "UGC", "After Effects", "Remotion"],
    category: "contenu",
  },
  {
    id: "ux-ui-design",
    name: "UX/UI Designer",
    shortName: "UX",
    description: "Design · Branding Visuel · Landing Page · Design System",
    systemPrompt: UX_UI_DESIGN_PROMPT,
    bgColor: "oklch(0.55 0.20 245)",
    emoji: "🎨",
    tags: ["UX/UI", "Branding", "Landing Page", "Infographie", "Design System"],
    category: "contenu",
  },
  {
    id: "marketing-digital",
    name: "Marketing Digital",
    shortName: "MKT",
    description: "SEO · Email · Paid Ads · Campagnes · Analytics Marketing",
    systemPrompt: MARKETING_DIGITAL_PROMPT,
    bgColor: "oklch(0.58 0.22 340)",
    emoji: "📊",
    tags: ["SEO/AEO/GEO", "Email Marketing", "Paid Ads", "Social Media", "Analytics"],
    category: "contenu",
  },

  // ─── BUSINESS ───
  {
    id: "crm",
    name: "Agent CRM",
    shortName: "CRM",
    description: "Prospection · Leads · Pipeline · Relances · Revenue Intelligence",
    systemPrompt: CRM_PROMPT,
    bgColor: "oklch(0.52 0.18 160)",
    emoji: "🤝",
    tags: ["CRM", "Prospection", "Leads", "Pipeline", "Revenue Intelligence"],
    category: "business",
  },
  {
    id: "finance",
    name: "Agent Finance",
    shortName: "FIN",
    description: "Comptabilité · Factures · Budget · FP&A · Détection fraude",
    systemPrompt: FINANCE_PROMPT,
    bgColor: "oklch(0.48 0.18 145)",
    emoji: "💰",
    tags: ["Finance", "Comptabilité", "Factures", "Budget", "FP&A"],
    category: "business",
  },
  {
    id: "surveillance-decision",
    name: "Surveillance & Décision",
    shortName: "KPI",
    description: "Monitoring KPIs · Anomalies · Alertes · Scénarios · Priorisation",
    systemPrompt: SURVEILLANCE_DECISION_PROMPT,
    bgColor: "oklch(0.60 0.20 65)",
    emoji: "👁️",
    tags: ["KPIs", "Anomalies", "Alertes", "Décision", "Reporting"],
    category: "business",
  },

  // ─── TECHNIQUE ───
  {
    id: "developpement-logiciel",
    name: "Développeur IA",
    shortName: "DEV",
    description: "Code · Bugs · API · Tests · Code Review · Architecture",
    systemPrompt: DEVELOPPEMENT_LOGICIEL_PROMPT,
    bgColor: "oklch(0.50 0.20 220)",
    emoji: "💻",
    tags: ["Code", "Bug Fix", "API", "Tests", "Code Review"],
    category: "technique",
  },
  {
    id: "devops",
    name: "Agent DevOps",
    shortName: "OPS",
    description: "CI/CD · Kubernetes · Cloud · Infrastructure · Monitoring",
    systemPrompt: DEVOPS_PROMPT,
    bgColor: "oklch(0.45 0.18 240)",
    emoji: "⚙️",
    tags: ["DevOps", "Kubernetes", "CI/CD", "Cloud", "Infrastructure as Code"],
    category: "technique",
  },
  {
    id: "data-analysis",
    name: "Data Analyst",
    shortName: "DATA",
    description: "BI · SQL · Dashboards · Forecasting · Anomalies · Storytelling",
    systemPrompt: DATA_ANALYSIS_PROMPT,
    bgColor: "oklch(0.52 0.19 195)",
    emoji: "📈",
    tags: ["Data Analysis", "BI", "SQL", "Forecasting", "Dashboards"],
    category: "technique",
  },
  {
    id: "cybersecurite",
    name: "Cybersécurité",
    shortName: "SEC",
    description: "SOC · Threat Detection · Logs · Incidents · Threat Hunting",
    systemPrompt: CYBERSECURITE_PROMPT,
    bgColor: "oklch(0.55 0.22 15)",
    emoji: "🛡️",
    tags: ["SOC", "Threat Detection", "Logs", "Incidents", "SIEM"],
    category: "technique",
  },
  {
    id: "process-automation",
    name: "Automation",
    shortName: "AUTO",
    description: "n8n · Make · Zapier · API · Workflows · Synchronisation systèmes",
    systemPrompt: PROCESS_AUTOMATION_PROMPT,
    bgColor: "oklch(0.52 0.20 140)",
    emoji: "⚡",
    tags: ["n8n", "Make", "Zapier", "API", "Workflows", "No-code"],
    category: "technique",
  },

  // ─── RH ───
  {
    id: "ressources-humaines",
    name: "Ressources Humaines",
    shortName: "RH",
    description: "Onboarding · Congés · Support RH · Workforce Intelligence",
    systemPrompt: RH_PROMPT,
    bgColor: "oklch(0.58 0.20 350)",
    emoji: "👥",
    tags: ["Onboarding", "Congés", "Support RH", "Workforce", "People Ops"],
    category: "rh",
  },
  {
    id: "recrutement",
    name: "Recrutement",
    shortName: "REC",
    description: "CV · Matching · Scoring · Sourcing · Entretiens · Shortlist",
    systemPrompt: RECRUTEMENT_PROMPT,
    bgColor: "oklch(0.55 0.18 330)",
    emoji: "🎯",
    tags: ["Recrutement", "CV", "Matching", "Scoring", "Talent Acquisition"],
    category: "rh",
  },
  {
    id: "documentaire",
    name: "Documentaire RAG",
    shortName: "DOC",
    description: "RAG · Contrats · Procédures · Knowledge Graph · Bases vectorielles",
    systemPrompt: DOCUMENTAIRE_PROMPT,
    bgColor: "oklch(0.50 0.18 275)",
    emoji: "📚",
    tags: ["RAG", "Contrats", "Procédures", "Knowledge Graph", "Recherche"],
    category: "rh",
  },
];

export const DEFAULT_AGENT = AGENTS[0];

export function getAgent(id: AgentId): AgentConfig {
  return AGENTS.find((a) => a.id === id) ?? DEFAULT_AGENT;
}

export function getAgentsByCategory(category: AgentCategory): AgentConfig[] {
  return AGENTS.filter((a) => a.category === category);
}
