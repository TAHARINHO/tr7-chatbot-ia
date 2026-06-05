"use client";

import {
  useState, useRef, useCallback, KeyboardEvent, useEffect,
} from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  SendIcon, StopCircleIcon, PaperclipIcon, ImageIcon,
  XIcon, FileTextIcon, AlertCircleIcon,
} from "lucide-react";
import { Attachment, SUPPORTED_IMAGE_TYPES, SUPPORTED_DOC_TYPES, MAX_FILE_SIZE_MB } from "@/types/chat";
import { fileToAttachment } from "@/store/chat-store";

interface ChatInputProps {
  onSend: (message: string, attachments?: Attachment[]) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onStop, isStreaming, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetHeight = useCallback(() => {
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if ((!trimmed && attachments.length === 0) || isStreaming || disabled) return;
    onSend(trimmed, attachments.length > 0 ? attachments : undefined);
    setValue("");
    setAttachments([]);
    setError(null);
    resetHeight();
  }, [value, attachments, isStreaming, disabled, onSend, resetHeight]);

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

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    const accepted = [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_DOC_TYPES];
    const errors: string[] = [];
    const newAtts: Attachment[] = [];

    for (const file of fileArr) {
      if (!accepted.includes(file.type)) {
        errors.push(`${file.name}: type non supporté`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errors.push(`${file.name}: trop lourd (max ${MAX_FILE_SIZE_MB}MB)`);
        continue;
      }
      try {
        const att = await fileToAttachment(file);
        newAtts.push(att);
      } catch {
        errors.push(`${file.name}: erreur de lecture`);
      }
    }

    if (errors.length > 0) setError(errors.join(" · "));
    else setError(null);

    if (newAtts.length > 0) {
      setAttachments((prev) => [...prev, ...newAtts].slice(0, 10));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = "";
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  // Paste images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const files: File[] = [];
      for (const item of items) {
        if (item.kind === "file") {
          const f = item.getAsFile();
          if (f) files.push(f);
        }
      }
      if (files.length > 0) processFiles(files);
    };
    document.addEventListener("paste", handlePaste);
    return () => document.removeEventListener("paste", handlePaste);
  }, [processFiles]);

  const canSend = (value.trim().length > 0 || attachments.length > 0) && !isStreaming && !disabled;

  return (
    <div className="px-4 pb-5 pt-2">
      {/* Drag overlay */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative rounded-2xl transition-all duration-200",
          "shadow-input focus-within:shadow-input-focus",
          dragOver && "ring-2 ring-violet-400 bg-violet-50/50"
        )}
      >
        {/* Attachment previews */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-3 pb-1">
            {attachments.map((att) => (
              <AttachmentPreview key={att.id} attachment={att} onRemove={removeAttachment} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-1.5 px-4 pt-2 text-xs text-red-500">
            <AlertCircleIcon className="h-3 w-3 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main input row */}
        <div className="flex items-end gap-2 bg-white rounded-2xl border border-border px-3 py-3">
          {/* File upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150 mb-0.5",
              "text-muted-foreground hover:text-violet-600 hover:bg-violet-50",
              (isStreaming || disabled) && "opacity-40 pointer-events-none"
            )}
            title="Joindre un fichier ou une image"
          >
            <PaperclipIcon className="h-4 w-4" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            multiple
            accept={[...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_DOC_TYPES].join(",")}
            onChange={handleFileChange}
          />

          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={
              attachments.length > 0
                ? "Ajouter un message (optionnel)… ou envoyer directement"
                : "Envoie un message, colle une image… (⇧↵ pour sauter une ligne)"
            }
            className="flex-1 min-h-[2rem] max-h-[200px] resize-none border-0 bg-transparent p-0 text-sm leading-relaxed placeholder:text-muted-foreground/40 focus-visible:ring-0 focus-visible:ring-offset-0 scrollbar-thin"
            rows={1}
            disabled={disabled}
          />

          {/* Send / Stop */}
          {isStreaming ? (
            <button
              onClick={onStop}
              className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 transition-colors mb-0.5"
              title="Arrêter"
            >
              <StopCircleIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                "flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-150 mb-0.5",
                canSend
                  ? "bg-violet-600 text-white hover:bg-violet-700 shadow-sm"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              title="Envoyer (Entrée)"
            >
              <SendIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Drag overlay visual */}
        {dragOver && (
          <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-violet-400 bg-violet-50/80 flex items-center justify-center pointer-events-none z-10">
            <div className="flex flex-col items-center gap-2 text-violet-600">
              <ImageIcon className="h-6 w-6" />
              <p className="text-sm font-medium">Déposer ici</p>
            </div>
          </div>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground/30 mt-2">
        TR7 ChatBot IA · Supporte images (JPG, PNG, WebP) et documents (PDF, TXT)
      </p>
    </div>
  );
}

function AttachmentPreview({ attachment, onRemove }: { attachment: Attachment; onRemove: (id: string) => void }) {
  return (
    <div className="relative group attachment-enter">
      {attachment.type === "image" && attachment.preview ? (
        <div className="relative">
          <img
            src={attachment.preview}
            alt={attachment.name}
            className="h-16 w-16 object-cover rounded-xl border border-border shadow-sm"
          />
          <div className="absolute inset-0 rounded-xl bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ) : (
        <div className="h-16 w-16 rounded-xl border border-border bg-violet-50 flex flex-col items-center justify-center gap-1">
          <FileTextIcon className="h-5 w-5 text-violet-500" />
          <span className="text-xs text-violet-600 px-1 truncate w-full text-center">
            {attachment.name.split(".").pop()?.toUpperCase()}
          </span>
        </div>
      )}
      {/* Remove button */}
      <button
        onClick={() => onRemove(attachment.id)}
        className="absolute -top-1.5 -right-1.5 h-4.5 w-4.5 rounded-full bg-slate-800 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
        style={{ width: 18, height: 18 }}
      >
        <XIcon style={{ width: 10, height: 10 }} />
      </button>
      {/* Name tooltip on hover */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none max-w-[120px] truncate">
        {attachment.name}
      </div>
    </div>
  );
}
