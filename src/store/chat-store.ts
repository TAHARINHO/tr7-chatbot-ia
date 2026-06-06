"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Conversation, Message, AIModel, DEFAULT_SYSTEM_PROMPT, Attachment } from "@/types/chat";
import { AgentId, DEFAULT_AGENT, getAgent } from "@/config/agents";
import { nanoid } from "nanoid";

interface ChatStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  selectedModel: AIModel;
  systemPrompt: string;
  sidebarOpen: boolean;
  selectedAgentId: AgentId;

  createConversation: () => string;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  addMessage: (
    conversationId: string,
    message: Omit<Message, "id" | "createdAt">
  ) => Message;
  updateLastAssistantMessage: (conversationId: string, content: string) => void;
  updateConversationTitle: (conversationId: string, title: string) => void;
  setModel: (model: AIModel) => void;
  setSystemPrompt: (prompt: string) => void;
  setAgent: (agentId: AgentId) => void;
  toggleSidebar: () => void;
  clearConversations: () => void;
  getActiveConversation: () => Conversation | undefined;
}

function createNewConversation(model: AIModel): Conversation {
  return {
    id: nanoid(),
    title: "Nouvelle conversation",
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    model,
  };
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      selectedModel: "claude-sonnet-4-6",
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      sidebarOpen: true,
      selectedAgentId: "general" as AgentId,

      createConversation: () => {
        const conv = createNewConversation(get().selectedModel);
        set((s) => ({
          conversations: [conv, ...s.conversations],
          activeConversationId: conv.id,
        }));
        return conv.id;
      },

      selectConversation: (id) => set({ activeConversationId: id }),

      deleteConversation: (id) => {
        const { conversations, activeConversationId } = get();
        const filtered = conversations.filter((c) => c.id !== id);
        const nextActive =
          activeConversationId === id
            ? (filtered[0]?.id ?? null)
            : activeConversationId;
        set({ conversations: filtered, activeConversationId: nextActive });
      },

      addMessage: (conversationId, messageData) => {
        const message: Message = {
          ...messageData,
          id: nanoid(),
          createdAt: new Date(),
        };
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  updatedAt: new Date(),
                }
              : c
          ),
        }));
        return message;
      },

      updateLastAssistantMessage: (conversationId, content) => {
        set((s) => ({
          conversations: s.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const msgs = [...c.messages];
            const lastIdx = msgs.map((m) => m.role).lastIndexOf("assistant");
            if (lastIdx === -1) return c;
            msgs[lastIdx] = { ...msgs[lastIdx], content };
            return { ...c, messages: msgs, updatedAt: new Date() };
          }),
        }));
      },

      updateConversationTitle: (conversationId, title) => {
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId ? { ...c, title } : c
          ),
        }));
      },

      setModel: (model) => set({ selectedModel: model }),
      setSystemPrompt: (prompt) => set({ systemPrompt: prompt }),
      setAgent: (agentId) => {
        const agent = getAgent(agentId);
        set({ selectedAgentId: agentId, systemPrompt: agent.systemPrompt });
      },
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      clearConversations: () =>
        set({ conversations: [], activeConversationId: null }),
      getActiveConversation: () => {
        const { conversations, activeConversationId } = get();
        return conversations.find((c) => c.id === activeConversationId);
      },
    }),
    {
      name: "tr7-chatbot-storage",
      partialize: (s) => ({
        conversations: s.conversations,
        activeConversationId: s.activeConversationId,
        selectedModel: s.selectedModel,
        systemPrompt: s.systemPrompt,
        sidebarOpen: s.sidebarOpen,
        selectedAgentId: s.selectedAgentId,
      }),
    }
  )
);

// Helper to create attachment from File object (client-side only)
export async function fileToAttachment(file: File): Promise<Attachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // result is "data:image/jpeg;base64,XXXXX"
      const base64 = result.split(",")[1];
      const preview = file.type.startsWith("image/") ? result : undefined;
      resolve({
        id: nanoid(),
        type: file.type.startsWith("image/") ? "image" : "document",
        name: file.name,
        mimeType: file.type,
        base64,
        preview,
        size: file.size,
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
