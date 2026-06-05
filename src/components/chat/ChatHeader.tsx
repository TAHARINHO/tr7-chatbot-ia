"use client";

import { useChatStore } from "@/store/chat-store";
import { MODELS, AIModel, Provider } from "@/types/chat";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, Trash2Icon } from "lucide-react";

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-xl transition-colors focus-visible:outline-none";

// Provider logos inline SVG
function AnthropicIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <path d="M13.83 2H10.17L2 22h3.83l1.64-4.27h9.05L18.17 22H22L13.83 2zm-5.2 12.37L12 5.93l3.37 8.44H8.63z" fill="currentColor" />
    </svg>
  );
}

function OpenAIIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0L4.06 14.124a4.501 4.501 0 0 1-1.72-6.228zm16.597 3.855l-5.843-3.387 2.02-1.168a.076.076 0 0 1 .071 0l4.858 2.801a4.494 4.494 0 0 1-.695 8.115V12.48a.767.767 0 0 0-.411-.729zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.844-2.798a4.5 4.5 0 0 1 6.669 4.66zm-12.66 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.396.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

const PROVIDER_LABELS: Record<Provider, string> = {
  anthropic: "Anthropic — Claude",
  openai: "OpenAI — ChatGPT",
};

const PROVIDER_COLORS: Record<Provider, string> = {
  anthropic: "text-orange-600",
  openai: "text-emerald-600",
};

export function ChatHeader() {
  const { selectedModel, setModel, activeConversationId, deleteConversation, getActiveConversation } =
    useChatStore();

  const currentModel = MODELS.find((m) => m.id === selectedModel) ?? MODELS[0];
  const activeConv = getActiveConversation();

  const anthropicModels = MODELS.filter((m) => m.provider === "anthropic");
  const openaiModels = MODELS.filter((m) => m.provider === "openai");

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-white/90 backdrop-blur-md flex-shrink-0">
      {/* Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <h1 className="text-sm font-semibold truncate text-foreground">
          {activeConv?.title ?? "Nouvelle conversation"}
        </h1>
        {activeConv && (
          <Badge variant="secondary" className="text-xs px-2 py-0 h-5 font-normal hidden sm:flex flex-shrink-0">
            {activeConv.messages.filter((m) => m.role === "user").length} msg
          </Badge>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Model + Provider selector */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-xl px-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none">
            <span className={PROVIDER_COLORS[currentModel.provider]}>
              {currentModel.provider === "anthropic"
                ? <AnthropicIcon />
                : <OpenAIIcon />}
            </span>
            <span className="hidden sm:inline">{currentModel.name}</span>
            <ChevronDownIcon className="h-3 w-3 opacity-50" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-72 bg-white border-border shadow-card-hover p-1">
            {/* ── Anthropic ── */}
            <DropdownMenuLabel className="flex items-center gap-2 text-xs font-semibold text-orange-600 px-2 py-1.5">
              <AnthropicIcon size={12} />
              {PROVIDER_LABELS.anthropic}
            </DropdownMenuLabel>
            {anthropicModels.map((model) => (
              <ModelMenuItem
                key={model.id}
                model={model}
                isSelected={selectedModel === model.id}
                onSelect={() => setModel(model.id as AIModel)}
              />
            ))}

            <DropdownMenuSeparator className="my-1" />

            {/* ── OpenAI ── */}
            <DropdownMenuLabel className="flex items-center gap-2 text-xs font-semibold text-emerald-600 px-2 py-1.5">
              <OpenAIIcon size={12} />
              {PROVIDER_LABELS.openai}
            </DropdownMenuLabel>
            {openaiModels.map((model) => (
              <ModelMenuItem
                key={model.id}
                model={model}
                isSelected={selectedModel === model.id}
                onSelect={() => setModel(model.id as AIModel)}
              />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete */}
        {activeConversationId && (
          <Tooltip>
            <TooltipTrigger
              className={`${iconBtn} text-muted-foreground hover:text-red-500 hover:bg-red-50`}
              onClick={() => deleteConversation(activeConversationId)}
            >
              <Trash2Icon className="h-3.5 w-3.5" />
            </TooltipTrigger>
            <TooltipContent>Supprimer</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

function ModelMenuItem({
  model,
  isSelected,
  onSelect,
}: {
  model: (typeof MODELS)[0];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <DropdownMenuItem
      onClick={onSelect}
      className={`flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer ${
        isSelected ? "bg-accent" : ""
      }`}
    >
      <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isSelected
          ? model.provider === "anthropic" ? "bg-orange-100 text-orange-600" : "bg-emerald-100 text-emerald-600"
          : "bg-muted text-muted-foreground"
      }`}>
        {model.provider === "anthropic" ? <AnthropicIcon size={12} /> : <OpenAIIcon size={12} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{model.name}</span>
          {model.badge && (
            <Badge
              variant="secondary"
              className={`h-4 text-xs px-1.5 border-0 ${
                model.provider === "anthropic"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {model.badge}
            </Badge>
          )}
          {isSelected && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500 flex-shrink-0" />}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-muted-foreground">{model.description}</p>
          <span className="text-xs text-muted-foreground/50">· {model.contextWindow}</span>
        </div>
      </div>
    </DropdownMenuItem>
  );
}
