"use client";

import { useEffect, useRef, useCallback } from "react";
import { useChatStore } from "@/store/chat-store";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { WelcomeScreen } from "./WelcomeScreen";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/hooks/use-chat";
import { Attachment } from "@/types/chat";

export function ChatArea() {
  const { getActiveConversation, activeConversationId } = useChatStore();
  const conversation = getActiveConversation();
  const bottomRef = useRef<HTMLDivElement>(null);

  const { sendMessage, stopStreaming, isStreaming, streamingMessageId } = useChat(
    activeConversationId
  );

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages.length, scrollToBottom]);

  useEffect(() => {
    if (isStreaming) scrollToBottom();
  }, [isStreaming, scrollToBottom]);

  const handleSend = useCallback(
    (content: string, attachments?: Attachment[]) => {
      sendMessage(content, attachments);
    },
    [sendMessage]
  );

  const messages = conversation?.messages ?? [];

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-background">
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="max-w-3xl mx-auto w-full">
          {messages.length === 0 ? (
            <WelcomeScreen onSuggestion={(prompt) => handleSend(prompt)} />
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
          <div ref={bottomRef} className="h-4" />
        </div>
      </ScrollArea>

      <div className="max-w-3xl mx-auto w-full flex-shrink-0">
        <ChatInput
          onSend={handleSend}
          onStop={stopStreaming}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
