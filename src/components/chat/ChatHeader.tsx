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
const openaiModels = MODELS.filter((m) => m.provider === "openai");

export function ChatHeader() {
  const {
    selectedModel,
    setModel,
    activeConversationId,
    deleteConversation,
    getActiveConversation,
  } = useChatStore();

  const currentModel = MODELS.find((m) => m.id === selectedModel) ?? MODELS[0];
  const activeConv = getActiveConversation();

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-white/90 backdrop-blur-md flex-shrink-0">
      {/* Titre */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
        <h1 className="text-sm font-semibold truncate text-foreground">
          {activeConv?.title ?? "Nouvelle conversation"}
        </h1>
        {activeConv && (
          <Badge
            variant="secondary"
            className="text-xs px-2 py-0 h-5 font-normal hidden sm:flex flex-shrink-0"
          >
            {activeConv.messages.filter((m) => m.role === "user").length} msg
          </Badge>
        )}
      </div>

      {/* Contrôles */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Sélecteur modèle */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex h-8 items-center gap-1.5 rounded-xl px-3 text-xs font-medium
                       text-muted-foreground hover:text-foreground hover:bg-accent
                       transition-colors focus-visible:outline-none"
          >
            <span
              className={
                currentModel.provider === "anthropic"
                  ? "text-orange-500"
                  : "text-emerald-500"
              }
            >
              {currentModel.provider === "anthropic" ? "A" : "G"}
            </span>
            <span className="hidden sm:inline max-w-[120px] truncate">
              {currentModel.name}
            </span>
            <ChevronDownIcon className="h-3 w-3 opacity-50 flex-shrink-0" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            side="bottom"
            sideOffset={6}
            className="!w-72 bg-white border-border shadow-lg p-1"
          >
            {/* ── Groupe Anthropic ── */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2 text-orange-600 font-semibold">
                <div className="h-4 w-4 rounded bg-orange-100 flex items-center justify-center text-[10px] font-bold text-orange-600">
                  A
                </div>
                Anthropic — Claude
              </DropdownMenuLabel>

              {anthropicModels.map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => setModel(model.id as AIModel)}
                  className="flex items-center gap-3 py-2.5 px-2 cursor-pointer rounded-lg"
                >
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      selectedModel === model.id
                        ? "bg-orange-100 text-orange-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    A
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium truncate">{model.name}</span>
                      {model.badge && (
                        <Badge
                          variant="secondary"
                          className="h-4 text-[10px] px-1.5 bg-orange-50 text-orange-700 border-0 flex-shrink-0"
                        >
                          {model.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {model.description} · {model.contextWindow}
                    </p>
                  </div>
                  {selectedModel === model.id && (
                    <CheckIcon className="h-4 w-4 text-violet-500 flex-shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* ── Groupe OpenAI ── */}
            <DropdownMenuGroup>
              <DropdownMenuLabel className="flex items-center gap-2 text-emerald-600 font-semibold">
                <div className="h-4 w-4 rounded bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                  G
                </div>
                OpenAI — ChatGPT
              </DropdownMenuLabel>

              {openaiModels.map((model) => (
                <DropdownMenuItem
                  key={model.id}
                  onClick={() => setModel(model.id as AIModel)}
                  className="flex items-center gap-3 py-2.5 px-2 cursor-pointer rounded-lg"
                >
                  <div
                    className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      selectedModel === model.id
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    G
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium truncate">{model.name}</span>
                      {model.badge && (
                        <Badge
                          variant="secondary"
                          className="h-4 text-[10px] px-1.5 bg-emerald-50 text-emerald-700 border-0 flex-shrink-0"
                        >
                          {model.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {model.description} · {model.contextWindow}
                    </p>
                  </div>
                  {selectedModel === model.id && (
                    <CheckIcon className="h-4 w-4 text-violet-500 flex-shrink-0" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Supprimer conversation */}
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
