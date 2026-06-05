"use client";

import { useEffect, useRef, useCallback } from "react";
import { useChatStore } from "@/store/chat-store";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { WelcomeScreen } from "./WelcomeScreen";
import { useChat } from "@/hooks/use-chat";
import { Attachment } from "@/types/chat";

export function ChatArea() {
  const { getActiveConversation, activeConversationId } = useChatStore();
  const conversation = getActiveConversation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { sendMessage, stopStreaming, isStreaming, streamingMessageId } = useChat(
    activeConversationId
  );

  const scrollToBottom = useCallback((smooth = true) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "instant",
      block: "end",
    });
  }, []);

  // Scroll immédiat au changement de conversation
  useEffect(() => {
    scrollToBottom(false);
  }, [activeConversationId, scrollToBottom]);

  // Scroll doux à chaque nouveau message
  useEffect(() => {
    scrollToBottom(true);
  }, [conversation?.messages.length, scrollToBottom]);

  // Scroll pendant le streaming
  useEffect(() => {
    if (isStreaming) {
      const container = scrollContainerRef.current;
      if (!container) return;
      // Auto-scroll uniquement si l'utilisateur est déjà en bas
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 120;
      if (isNearBottom) scrollToBottom(false);
    }
  });

  const handleSend = useCallback(
    (content: string, attachments?: Attachment[]) => sendMessage(content, attachments),
    [sendMessage]
  );

  const messages = conversation?.messages ?? [];

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden bg-background">
      {/* Zone de messages — seule partie scrollable */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin"
      >
        <div className="max-w-3xl mx-auto w-full px-2">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestion={(p) => handleSend(p)} />
          ) : (
            <div className="py-4 space-y-1">
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isStreaming={isStreaming && msg.id === streamingMessageId}
                />
              ))}
            </div>
          )}
          {/* Ancre de scroll — toujours visible en bas */}
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </div>

      {/* Input fixe en bas — ne scroll pas */}
      <div className="flex-shrink-0 bg-background border-t border-border/50">
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput onSend={handleSend} onStop={stopStreaming} isStreaming={isStreaming} />
        </div>
      </div>
    </div>
  );
}
