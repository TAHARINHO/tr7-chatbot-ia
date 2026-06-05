"use client";

import { useChatStore } from "@/store/chat-store";
import { MODELS, AIModel } from "@/types/chat";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, Trash2Icon, CheckIcon } from "lucide-react";

const iconBtn =
  "inline-flex h-8 w-8 items-center justify-center rounded-xl transition-colors focus-visible:outline-none";

const anthropicModels = MODELS.filter((m) => m.provider === "anthropic");
const openaiModels    = MODELS.filter((m) => m.provider === "openai");
const googleModels    = MODELS.filter((m) => m.provider === "google");

const PROVIDER_STYLE = {
  anthropic: { bg: "bg-orange-100",  text: "text-orange-600",  letter: "A", label: "Anthropic — Claude"   },
  openai:    { bg: "bg-emerald-100", text: "text-emerald-600", letter: "G", label: "OpenAI — ChatGPT"     },
  google:    { bg: "bg-blue-100",    text: "text-blue-600",    letter: "✦", label: "Google — Gemini"      },
} as const;

function ProviderBadge({ provider, size = "sm" }: { provider: keyof typeof PROVIDER_STYLE; size?: "sm" | "xs" }) {
  const s = PROVIDER_STYLE[provider];
  const dim = size === "xs" ? "h-4 w-4 text-[10px]" : "h-7 w-7 text-xs";
  return (
    <div className={`${dim} rounded-lg flex items-center justify-center flex-shrink-0 font-bold ${s.bg} ${s.text}`}>
      {s.letter}
    </div>
  );
}

export function ChatHeader() {
  const {
    selectedModel, setModel,
    activeConversationId, deleteConversation, getActiveConversation,
  } = useChatStore();

  const currentModel = MODELS.find((m) => m.id === selectedModel) ?? MODELS[0];
  const activeConv = getActiveConversation();
  const ps = PROVIDER_STYLE[currentModel.provider];

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-white/90 backdrop-blur-md flex-shrink-0">
      {/* Titre */}
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

      {/* Contrôles */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Sélecteur 3 providers */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-xl px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none">
            <span className={`text-xs font-bold ${ps.text}`}>{ps.letter}</span>
            <span className="hidden sm:inline max-w-[110px] truncate">{currentModel.name}</span>
            <ChevronDownIcon className="h-3 w-3 opacity-50 flex-shrink-0" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            side="bottom"
            sideOffset={6}
            className="!w-80 bg-white border-border shadow-lg p-1"
          >
            {/* ── Anthropic ── */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className={`flex items-center gap-2 font-semibold ${PROVIDER_STYLE.anthropic.text}`}>
                <ProviderBadge provider="anthropic" size="xs" />
                {PROVIDER_STYLE.anthropic.label}
              </DropdownMenuLabel>
              {anthropicModels.map((model) => (
                <ModelRow
                  key={model.id}
                  model={model}
                  isSelected={selectedModel === model.id}
                  onSelect={() => setModel(model.id as AIModel)}
                />
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* ── OpenAI ── */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className={`flex items-center gap-2 font-semibold ${PROVIDER_STYLE.openai.text}`}>
                <ProviderBadge provider="openai" size="xs" />
                {PROVIDER_STYLE.openai.label}
              </DropdownMenuLabel>
              {openaiModels.map((model) => (
                <ModelRow
                  key={model.id}
                  model={model}
                  isSelected={selectedModel === model.id}
                  onSelect={() => setModel(model.id as AIModel)}
                />
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* ── Google Gemini ── */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className={`flex items-center gap-2 font-semibold ${PROVIDER_STYLE.google.text}`}>
                <ProviderBadge provider="google" size="xs" />
                {PROVIDER_STYLE.google.label}
              </DropdownMenuLabel>
              {googleModels.map((model) => (
                <ModelRow
                  key={model.id}
                  model={model}
                  isSelected={selectedModel === model.id}
                  onSelect={() => setModel(model.id as AIModel)}
                />
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Supprimer */}
        {activeConversationId && (
          <Tooltip>
            <TooltipTrigger
              className={`${iconBtn} text-muted-foreground hover:text-red-500 hover:bg-red-50`}
              onClick={() => deleteConversation(activeConversationId)}
            >
              <Trash2Icon className="h-3.5 w-3.5" />
            </TooltipTrigger>
            <TooltipContent>Supprimer la conversation</TooltipContent>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

function ModelRow({
  model,
  isSelected,
  onSelect,
}: {
  model: (typeof MODELS)[0];
  isSelected: boolean;
  onSelect: () => void;
}) {
  const ps = PROVIDER_STYLE[model.provider];
  return (
    <DropdownMenuItem
      onClick={onSelect}
      className="flex items-center gap-3 py-2 px-2 cursor-pointer rounded-lg"
    >
      <ProviderBadge provider={model.provider} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium truncate">{model.name}</span>
          {model.badge && (
            <Badge
              variant="secondary"
              className={`h-4 text-[10px] px-1.5 border-0 flex-shrink-0 ${ps.bg} ${ps.text}`}
            >
              {model.badge}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {model.description}
          <span className="text-muted-foreground/50"> · {model.contextWindow}</span>
        </p>
      </div>
      {isSelected && <CheckIcon className="h-4 w-4 text-violet-500 flex-shrink-0" />}
    </DropdownMenuItem>
  );
}
