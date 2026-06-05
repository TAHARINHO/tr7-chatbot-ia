export type Role = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
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
  | "claude-sonnet-4-6"
  | "claude-opus-4-8"
  | "claude-haiku-4-5-20251001";

export interface ModelConfig {
  id: AIModel;
  name: string;
  description: string;
  maxTokens: number;
  badge?: string;
}

export const MODELS: ModelConfig[] = [
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet",
    description: "Équilibre performance / vitesse",
    maxTokens: 8192,
    badge: "Recommandé",
  },
  {
    id: "claude-opus-4-8",
    name: "Claude Opus",
    description: "Le plus puissant, raisonnement avancé",
    maxTokens: 8192,
    badge: "Pro",
  },
  {
    id: "claude-haiku-4-5-20251001",
    name: "Claude Haiku",
    description: "Ultra-rapide et économique",
    maxTokens: 4096,
    badge: "Rapide",
  },
];

export const DEFAULT_SYSTEM_PROMPT = `Tu es un assistant IA intelligent créé par TR7 Agency. Tu réponds toujours en français sauf si l'utilisateur écrit dans une autre langue. Tu es direct, précis, et utile. Tu peux aider avec le code, la rédaction, l'analyse, la stratégie, et bien plus encore.`;
