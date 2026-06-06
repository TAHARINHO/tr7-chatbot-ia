"use client";

import { Message, Attachment } from "@/types/chat";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/date-utils";
import { CopyIcon, CheckIcon, FileTextIcon, DownloadIcon } from "lucide-react";
import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneLight from "react-syntax-highlighter/dist/esm/styles/prism/one-light";
import type { Components } from "react-markdown";
import type { CSSProperties } from "react";
import { AIAvatar, UserAvatar, InayaAvatar } from "./Avatars";
import { useChatStore } from "@/store/chat-store";
import { AGENTS } from "@/config/agents";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const { selectedAgentId } = useChatStore();
  const currentAgent = AGENTS.find((a) => a.id === selectedAgentId) ?? AGENTS[0];

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-2 message-enter",
        isUser ? "flex-row-reverse" : "flex-row",
        "items-end"
      )}
    >
      {/* Avatar — INAYA ou générique */}
      {isUser ? (
        <UserAvatar size="sm" initials="T" />
      ) : currentAgent.persona ? (
        <InayaAvatar persona={currentAgent.persona} size="sm" isActive={isStreaming} />
      ) : (
        <AIAvatar size="sm" isActive={isStreaming} />
      )}

      {/* Content */}
      <div
        className={cn(
          "flex flex-col max-w-[76%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        {/* Attachments preview (images shown above bubble) */}
        {message.attachments && message.attachments.length > 0 && (
          <div className={cn("flex flex-wrap gap-2 mb-2", isUser ? "justify-end" : "justify-start")}>
            {message.attachments.map((att) => (
              <AttachmentChip key={att.id} attachment={att} />
            ))}
          </div>
        )}

        {/* Bubble */}
        {message.content && (
          <div
            className={cn(
              "relative rounded-2xl px-4 py-3 text-sm leading-relaxed",
              isUser
                ? "bubble-user text-white shadow-bubble-user rounded-br-sm"
                : "bg-white text-foreground shadow-card rounded-bl-sm"
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            ) : (
              <div>
                {isStreaming && message.content === "" ? (
                  <TypingIndicator />
                ) : (
                  <MarkdownRenderer content={message.content} />
                )}
                {isStreaming && message.content !== "" && (
                  <span className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 animate-pulse rounded-full" />
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty assistant bubble (streaming, no content yet) */}
        {!message.content && message.role === "assistant" && (
          <div className="bg-white shadow-card rounded-2xl rounded-bl-sm px-4 py-3">
            <TypingIndicator />
          </div>
        )}

        {/* Meta row */}
        <div className={cn("flex items-center gap-2 mt-1 px-1", isUser ? "flex-row-reverse" : "flex-row")}>
          <span className="text-xs text-muted-foreground/50">
            {formatTime(message.createdAt)}
          </span>
          {!isUser && !isStreaming && message.content && (
            <CopyButton text={message.content} />
          )}
        </div>
      </div>
    </div>
  );
}

function AttachmentChip({ attachment }: { attachment: Attachment }) {
  if (attachment.type === "image" && attachment.preview) {
    return (
      <div className="relative group attachment-enter">
        <img
          src={attachment.preview}
          alt={attachment.name}
          className="h-32 w-32 object-cover rounded-xl shadow-card border border-border"
        />
        <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-medium px-2 text-center line-clamp-2">
            {attachment.name}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-white shadow-card border border-border rounded-xl px-3 py-2 attachment-enter">
      <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
        <FileTextIcon className="h-4 w-4 text-violet-500" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-foreground truncate max-w-[120px]">
          {attachment.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {(attachment.size / 1024).toFixed(0)} KB
        </p>
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return (
    <button
      onClick={handleCopy}
      className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
    >
      {copied ? (
        <CheckIcon className="h-3 w-3 text-violet-500" />
      ) : (
        <CopyIcon className="h-3 w-3" />
      )}
    </button>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-0.5 px-1">
      <span className="typing-dot h-2 w-2 rounded-full bg-violet-400" />
      <span className="typing-dot h-2 w-2 rounded-full bg-violet-400" />
      <span className="typing-dot h-2 w-2 rounded-full bg-violet-400" />
    </div>
  );
}

const mdComponents: Components = {
  code({ className, children }) {
    const match = /language-(\w+)/.exec(className || "");
    const codeStr = String(children).replace(/\n$/, "");
    if (match) {
      return (
        <div className="relative my-3 rounded-xl overflow-hidden border border-border shadow-sm">
          <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
            <span className="text-xs text-muted-foreground font-mono font-medium">
              {match[1]}
            </span>
            <CopyButton text={codeStr} />
          </div>
          <SyntaxHighlighter
            style={oneLight as Record<string, CSSProperties>}
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: 0,
              background: "oklch(0.98 0.008 280)",
              padding: "1rem",
              fontSize: "0.8rem",
            }}
          >
            {codeStr}
          </SyntaxHighlighter>
        </div>
      );
    }
    return (
      <code className="rounded-md px-1.5 py-0.5 bg-violet-50 font-mono text-xs text-violet-700 border border-violet-100">
        {children}
      </code>
    );
  },
  a({ href, children }) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer"
        className="text-violet-600 hover:text-violet-700 underline underline-offset-2">
        {children}
      </a>
    );
  },
  p({ children }) { return <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>; },
  ul({ children }) { return <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>; },
  ol({ children }) { return <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>; },
  li({ children }) { return <li className="text-sm">{children}</li>; },
  h1({ children }) { return <h1 className="text-lg font-bold mb-3 mt-1">{children}</h1>; },
  h2({ children }) { return <h2 className="text-base font-semibold mb-2 mt-3">{children}</h2>; },
  h3({ children }) { return <h3 className="text-sm font-semibold mb-1 mt-2">{children}</h3>; },
  blockquote({ children }) {
    return (
      <blockquote className="border-l-3 border-violet-300 pl-4 my-2 text-muted-foreground italic bg-violet-50/50 py-1 rounded-r-lg">
        {children}
      </blockquote>
    );
  },
  strong({ children }) {
    return <strong className="font-semibold text-foreground">{children}</strong>;
  },
  hr() { return <hr className="border-border my-4" />; },
};

function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed">
      <ReactMarkdown components={mdComponents}>{content}</ReactMarkdown>
    </div>
  );
}
