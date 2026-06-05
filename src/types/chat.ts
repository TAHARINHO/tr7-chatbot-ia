export type Role = "user" | "assistant" | "system";
export type Provider = "anthropic" | "openai" | "google";

export interface Attachment {
  id: string;
  type: "image" | "document";
  name: string;
  mimeType: string;
  base64: string;
  preview?: string;
  size: number;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  attachments?: Attachment[];
  createdAt: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  model: AIModel;
}

export type AIModel =
  // ── Anthropic ──
  | "claude-sonnet-4-6"
  | "claude-opus-4-8"
  | "claude-haiku-4-5-20251001"
  // ── OpenAI ──
  | "gpt-4o"
  | "gpt-4o-mini"
  | "o1"
  | "o1-mini"
  // ── Google Gemini ──
  | "gemini-3.5-flash"
  | "gemini-3.1-pro-preview"
  | "gemini-3-pro-preview"
  | "gemini-2.5-pro"
  | "gemini-2.5-flash"
  | "gemini-2.0-flash";

export interface ModelConfig {
  id: AIModel;
  name: string;
  description: string;
  badge?: string;
  supportsVision: boolean;
  provider: Provider;
  contextWindow: string;
}

export const MODELS: ModelConfig[] = [
  // ─────────────── Anthropic ───────────────
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet 4",
    description: "Équilibre vitesse / intelligence",
    badge: "Recommandé",
    supportsVision: true,
    provider: "anthropic",
    contextWindow: "200K",
  },
  {
    id: "claude-opus-4-8",
    name: "Claude Opus 4",
    description: "Le plus puissant d'Anthropic",
    badge: "Pro",
    supportsVision: true,
    provider: "anthropic",
    contextWindow: "200K",
  },
  {
    id: "claude-haiku-4-5-20251001",
    name: "Claude Haiku",
    description: "Ultra-rapide et économique",
    badge: "Rapide",
    supportsVision: true,
    provider: "anthropic",
    contextWindow: "200K",
  },

  // ─────────────── OpenAI ───────────────
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Flagship multimodal d'OpenAI",
    badge: "Recommandé",
    supportsVision: true,
    provider: "openai",
    contextWindow: "128K",
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Rapide et économique",
    badge: "Rapide",
    supportsVision: true,
    provider: "openai",
    contextWindow: "128K",
  },
  {
    id: "o1",
    name: "o1",
    description: "Raisonnement avancé (STEM, code)",
    badge: "Reasoning",
    supportsVision: false,
    provider: "openai",
    contextWindow: "200K",
  },
  {
    id: "o1-mini",
    name: "o1-mini",
    description: "Raisonnement rapide et léger",
    badge: "Reasoning",
    supportsVision: false,
    provider: "openai",
    contextWindow: "128K",
  },

  // ─────────────── Google Gemini ───────────────
  {
    id: "gemini-3.5-flash",
    name: "Gemini 3.5 Flash",
    description: "Le plus récent et rapide de Google",
    badge: "Nouveau",
    supportsVision: true,
    provider: "google",
    contextWindow: "1M",
  },
  {
    id: "gemini-3.1-pro-preview",
    name: "Gemini 3.1 Pro",
    description: "Gemini 3ème gen — très puissant",
    badge: "Pro",
    supportsVision: true,
    provider: "google",
    contextWindow: "1M",
  },
  {
    id: "gemini-3-pro-preview",
    name: "Gemini 3 Pro",
    description: "Raisonnement avancé, multimodal",
    badge: "Recommandé",
    supportsVision: true,
    provider: "google",
    contextWindow: "1M",
  },
  {
    id: "gemini-2.5-pro",
    name: "Gemini 2.5 Pro",
    description: "Très capable, contexte long",
    badge: "Capable",
    supportsVision: true,
    provider: "google",
    contextWindow: "1M",
  },
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    description: "Rapide et multimodal",
    badge: "Rapide",
    supportsVision: true,
    provider: "google",
    contextWindow: "1M",
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description: "Stable, polyvalent et efficace",
    badge: "Stable",
    supportsVision: true,
    provider: "google",
    contextWindow: "1M",
  },
];

export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
export const SUPPORTED_DOC_TYPES = ["application/pdf", "text/plain", "text/csv", "text/html", "text/markdown"];
export const MAX_FILE_SIZE_MB = 10;

export const DEFAULT_SYSTEM_PROMPT = `Tu es un assistant IA intelligent créé par TR7 Agency. Tu réponds toujours en français sauf si l'utilisateur écrit dans une autre langue. Tu es direct, précis, et utile. Tu peux aider avec le code, la rédaction, l'analyse, la stratégie, et bien plus encore. Quand on te partage une image ou un document, tu l'analyses en détail et fournis une réponse précise.`;
