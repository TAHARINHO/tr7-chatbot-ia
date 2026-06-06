"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/chat-store";
import { AgentId, AGENTS } from "@/config/agents";
import { ChatLayout } from "./ChatLayout";

interface AgentChatPageProps {
  agentId: AgentId;
}

export function AgentChatPage({ agentId }: AgentChatPageProps) {
  const { setAgent, selectedAgentId, conversations, createConversation } = useChatStore();

  useEffect(() => {
    // Sélectionner l'agent si ce n'est pas déjà le cas
    if (selectedAgentId !== agentId) {
      setAgent(agentId);
    }
    // Créer une conversation si aucune n'existe
    if (conversations.length === 0) {
      createConversation();
    }
  }, [agentId]); // eslint-disable-line react-hooks/exhaustive-deps

  return <ChatLayout />;
}
