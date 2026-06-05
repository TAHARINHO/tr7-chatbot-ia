export type Role = "user" | "assistant" | "system";

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
  | "claude-sonnet-4-6"
  | "claude-opus-4-8"
  | "claude-haiku-4-5-20251001";

export interface ModelConfig {
  id: AIModel;
  name: string;
  description: string;
  maxTokens: number;
  badge?: string;
  supportsVision: boolean;
}

export const MODELS: ModelConfig[] = [
  {
    id: "claude-sonnet-4-6",
    name: "Claude Sonnet",
    description: "Équilibre performance / vitesse",
    maxTokens: 8192,
    badge: "Recommandé",
    supportsVision: true,
  },
  {
    id: "claude-opus-4-8",
    name: "Claude Opus",
    description: "Le plus puissant, raisonnement avancé",
    maxTokens: 8192,
    badge: "Pro",
    supportsVision: true,
  },
  {
    id: "claude-haiku-4-5-20251001",
    name: "Claude Haiku",
    description: "Ultra-rapide et économique",
    maxTokens: 4096,
    badge: "Rapide",
    supportsVision: true,
  },
];

export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
export const SUPPORTED_DOC_TYPES = ["application/pdf", "text/plain", "text/csv", "text/html", "text/markdown"];
export const MAX_FILE_SIZE_MB = 10;

export const DEFAULT_SYSTEM_PROMPT = `Tu es un assistant IA intelligent créé par TR7 Agency. Tu réponds toujours en français sauf si l'utilisateur écrit dans une autre langue. Tu es direct, précis, et utile. Tu peux aider avec le code, la rédaction, l'analyse, la stratégie, et bien plus encore. Quand on te partage une image ou un document, tu l'analyses en détail et fournis une réponse précise et utile.`;
