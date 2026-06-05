"use client";

import { useState, useRef, useCallback } from "react";
import { useChatStore } from "@/store/chat-store";
import { Attachment } from "@/types/chat";

export function useChat(conversationId: string | null) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    selectedModel,
    systemPrompt,
    addMessage,
    updateLastAssistantMessage,
    updateConversationTitle,
    createConversation,
  } = useChatStore();

  const sendMessage = useCallback(
    async (content: string, attachments?: Attachment[]) => {
      let activeId = conversationId;
      if (!activeId) activeId = createConversation();

      const userMsg = addMessage(activeId, { role: "user", content, attachments });
      const assistantMsg = addMessage(activeId, { role: "assistant", content: "" });

      setStreamingMessageId(assistantMsg.id);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const conv = useChatStore.getState().conversations.find((c) => c.id === activeId);

      // Build API messages :
      // - Exclude current placeholder assistant message
      // - Exclude empty content messages (leftover from failed attempts)
      // - Exclude error messages stored as assistant responses (⚠️ prefix)
      // - Ensure strict user/assistant alternation
      const rawMessages = (conv?.messages ?? [])
        .filter((m) => m.role !== "system" && m.id !== assistantMsg.id)
        .filter((m) => {
          const txt = m.content.trim();
          if (!txt && (!m.attachments || m.attachments.length === 0)) return false; // empty
          if (m.role === "assistant" && txt.startsWith("⚠️")) return false; // stored error
          return true;
        });

      // Enforce alternation: remove consecutive same-role messages (keep last)
      const apiMessages: typeof rawMessages = [];
      for (const msg of rawMessages) {
        const last = apiMessages[apiMessages.length - 1];
        if (last && last.role === msg.role) {
          apiMessages[apiMessages.length - 1] = msg; // replace with latest
        } else {
          apiMessages.push(msg);
        }
      }

      // Anthropic requires first message to be from user
      while (apiMessages.length > 0 && apiMessages[0].role !== "user") {
        apiMessages.shift();
      }

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: apiMessages.map((m) => ({
              role: m.role,
              content: m.content,
              attachments: m.attachments,
            })),
            model: selectedModel,
            systemPrompt,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const errBody = await res.json().catch(() => ({}));
          updateLastAssistantMessage(activeId!, `⚠️ ${errBody?.error ?? `Erreur HTTP ${res.status}`}`);
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

          if (chunk.includes("\x00ERR:")) {
            const errMsg = chunk.split("\x00ERR:")[1] ?? "Erreur inconnue";
            let displayMsg = `⚠️ ${errMsg}`;
            if (errMsg.includes("credit balance")) {
              displayMsg = "⚠️ **Crédits Anthropic insuffisants.**\n\nRechargez sur [console.anthropic.com/settings/plans](https://console.anthropic.com/settings/plans)";
            } else if (errMsg.includes("invalid_api_key") || errMsg.includes("authentication")) {
              displayMsg = "⚠️ Clé API invalide. Vérifiez `ANTHROPIC_API_KEY`.";
            }
            updateLastAssistantMessage(activeId!, displayMsg);
            return;
          }

          fullContent += chunk;
          updateLastAssistantMessage(activeId!, fullContent);
        }

        // Auto-title
        const currentConv = useChatStore.getState().conversations.find((c) => c.id === activeId);
        if (currentConv?.title === "Nouvelle conversation" && userMsg.content) {
          updateConversationTitle(activeId!, userMsg.content.slice(0, 50).trim());
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          // User stopped — keep partial content if any, else show neutral message
          const currentConv = useChatStore.getState().conversations.find((c) => c.id === activeId);
          const currentAssistant = currentConv?.messages.find((m) => m.id === assistantMsg.id);
          if (!currentAssistant?.content) {
            updateLastAssistantMessage(activeId!, "_Génération arrêtée._");
          }
          return;
        }
        updateLastAssistantMessage(activeId!, "⚠️ Une erreur réseau est survenue. Veuillez réessayer.");
      } finally {
        setIsStreaming(false);
        setStreamingMessageId(null);
        abortControllerRef.current = null;
      }
    },
    [conversationId, selectedModel, systemPrompt, addMessage, updateLastAssistantMessage, updateConversationTitle, createConversation]
  );

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  return { sendMessage, stopStreaming, isStreaming, streamingMessageId };
}
