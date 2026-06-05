"use client";

import { useState, useRef, useCallback } from "react";
import { useChatStore } from "@/store/chat-store";

export function useChat(conversationId: string | null) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    conversations,
    selectedModel,
    systemPrompt,
    addMessage,
    updateLastAssistantMessage,
    updateConversationTitle,
    createConversation,
  } = useChatStore();

  const sendMessage = useCallback(
    async (content: string) => {
      let activeId = conversationId;

      if (!activeId) {
        activeId = createConversation();
      }

      const userMsg = addMessage(activeId, { role: "user", content });

      const assistantMsg = addMessage(activeId, {
        role: "assistant",
        content: "",
      });

      setStreamingMessageId(assistantMsg.id);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const conv = useChatStore
        .getState()
        .conversations.find((c) => c.id === activeId);

      const apiMessages = (conv?.messages ?? [])
        .filter((m) => m.role !== "system" && m.id !== assistantMsg.id)
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages,
            model: selectedModel,
            systemPrompt,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          const errMsg = errBody?.error ?? `Erreur HTTP ${res.status}`;
          updateLastAssistantMessage(activeId!, `⚠️ ${errMsg}`);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream reader");

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          updateLastAssistantMessage(activeId!, fullContent);
        }

        // Auto-generate title from first exchange
        const currentConv = useChatStore
          .getState()
          .conversations.find((c) => c.id === activeId);
        if (currentConv?.title === "Nouvelle conversation" && userMsg.content) {
          const title = userMsg.content.slice(0, 50).trim();
          updateConversationTitle(activeId!, title);
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // Streaming stopped by user — keep what we have
        } else {
          updateLastAssistantMessage(
            activeId!,
            "Une erreur est survenue. Veuillez réessayer."
          );
        }
      } finally {
        setIsStreaming(false);
        setStreamingMessageId(null);
        abortControllerRef.current = null;
      }
    },
    [
      conversationId,
      selectedModel,
      systemPrompt,
      addMessage,
      updateLastAssistantMessage,
      updateConversationTitle,
      createConversation,
    ]
  );

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return { sendMessage, stopStreaming, isStreaming, streamingMessageId };
}
