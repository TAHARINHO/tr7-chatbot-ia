"use client";

import { useState, useRef, useCallback, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SendIcon, StopCircleIcon, PaperclipIcon } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onStop, isStreaming, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, isStreaming, disabled, onSend]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  };

  const canSend = value.trim().length > 0 && !isStreaming && !disabled;

  return (
    <div className="px-4 pb-4 pt-2">
      <div
        className={cn(
          "flex items-end gap-2 rounded-2xl border bg-white/5 px-4 py-3 transition-all duration-200",
          canSend || isStreaming
            ? "border-primary/30 shadow-[0_0_0_1px_oklch(0.65_0.22_295_/_15%)]"
            : "border-white/8"
        )}
      >
        {/* Attachment button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0 text-muted-foreground/40 hover:text-muted-foreground mb-0.5"
          disabled
        >
          <PaperclipIcon className="h-4 w-4" />
        </Button>

        {/* Textarea */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Envoie un message… (Shift+Entrée pour sauter une ligne)"
          className="flex-1 min-h-[2rem] max-h-[200px] resize-none border-0 bg-transparent p-0 text-sm leading-relaxed placeholder:text-muted-foreground/30 focus-visible:ring-0 focus-visible:ring-offset-0 scrollbar-thin"
          rows={1}
          disabled={disabled}
        />

        {/* Send / Stop button */}
        {isStreaming ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 flex-shrink-0 text-primary hover:text-primary hover:bg-primary/10 mb-0.5"
            onClick={onStop}
          >
            <StopCircleIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 flex-shrink-0 mb-0.5 transition-all duration-150",
              canSend
                ? "text-primary hover:text-primary hover:bg-primary/10"
                : "text-muted-foreground/30 cursor-not-allowed"
            )}
            onClick={handleSend}
            disabled={!canSend}
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground/25 mt-2">
        TR7 ChatBot IA peut faire des erreurs. Vérifiez les informations importantes.
      </p>
    </div>
  );
}
