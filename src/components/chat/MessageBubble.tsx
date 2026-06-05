"use client";

import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/date-utils";
import { SparklesIcon, UserIcon, CopyIcon, CheckIcon } from "lucide-react";
import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";
import type { CSSProperties } from "react";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3 message-enter",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-0.5",
          isUser
            ? "bg-primary/20 border border-primary/30"
            : "bg-white/5 border border-white/10"
        )}
      >
        {isUser ? (
          <UserIcon className="h-3.5 w-3.5 text-primary" />
        ) : (
          <SparklesIcon className="h-3.5 w-3.5 text-primary" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "flex flex-col max-w-[80%] gap-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-primary/15 border border-primary/20 text-foreground rounded-tr-sm"
              : "bg-white/5 border border-white/8 text-foreground rounded-tl-sm"
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
                <span className="inline-block w-1 h-4 bg-primary ml-0.5 animate-pulse rounded-sm" />
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-muted-foreground/40">
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
        <CheckIcon className="h-3 w-3 text-primary" />
      ) : (
        <CopyIcon className="h-3 w-3" />
      )}
    </button>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary/60" />
      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary/60" />
      <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary/60" />
    </div>
  );
}

const mdComponents: Components = {
  code({ className, children }) {
    const match = /language-(\w+)/.exec(className || "");
    const codeStr = String(children).replace(/\n$/, "");
    if (match) {
      return (
        <div className="relative group my-2 rounded-xl overflow-hidden border border-white/8">
          <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
            <span className="text-xs text-muted-foreground/60 font-mono">
              {match[1]}
            </span>
            <CopyButton text={codeStr} />
          </div>
          <SyntaxHighlighter
            style={oneDark as Record<string, CSSProperties>}
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: 0,
              background: "transparent",
              padding: "1rem",
              fontSize: "0.8125rem",
            }}
          >
            {codeStr}
          </SyntaxHighlighter>
        </div>
      );
    }
    return (
      <code className="rounded px-1.5 py-0.5 bg-white/8 font-mono text-xs text-primary/90">
        {children}
      </code>
    );
  },
  a({ href, children }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        {children}
      </a>
    );
  },
  p({ children }) {
    return <p className="mb-2 last:mb-0">{children}</p>;
  },
  ul({ children }) {
    return <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>;
  },
  h1({ children }) {
    return <h1 className="text-base font-semibold mb-2">{children}</h1>;
  },
  h2({ children }) {
    return <h2 className="text-sm font-semibold mb-1">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="text-sm font-medium mb-1">{children}</h3>;
  },
  blockquote({ children }) {
    return (
      <blockquote className="border-l-2 border-primary/40 pl-3 text-muted-foreground">
        {children}
      </blockquote>
    );
  },
};

function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed">
      <ReactMarkdown components={mdComponents}>{content}</ReactMarkdown>
    </div>
  );
}
