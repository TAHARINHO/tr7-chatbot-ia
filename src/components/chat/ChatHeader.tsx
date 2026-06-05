"use client";

import { useChatStore } from "@/store/chat-store";
import { MODELS, AIModel } from "@/types/chat";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, Trash2Icon, SettingsIcon, SparklesIcon } from "lucide-react";

const iconTriggerClass =
  "inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors focus-visible:outline-none";

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
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-background/80 backdrop-blur-sm flex-shrink-0">
      {/* Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
        <h1 className="text-sm font-medium truncate text-foreground/80">
          {activeConv?.title ?? "TR7 ChatBot IA"}
        </h1>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Model selector */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors focus-visible:outline-none">
            <SparklesIcon className="h-3 w-3 text-primary" />
            {currentModel.name}
            <ChevronDownIcon className="h-3 w-3 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 bg-card border-white/10 text-foreground"
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Choisir un modèle
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/8" />
            {MODELS.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => setModel(model.id as AIModel)}
                className={`flex flex-col items-start gap-0.5 cursor-pointer py-2 ${
                  selectedModel === model.id ? "bg-primary/10" : ""
                }`}
              >
                <div className="flex items-center gap-2 w-full">
                  <span className="text-sm font-medium">{model.name}</span>
                  {model.badge && (
                    <Badge
                      variant="secondary"
                      className="h-4 text-xs px-1.5 bg-primary/15 text-primary border-0"
                    >
                      {model.badge}
                    </Badge>
                  )}
                  {selectedModel === model.id && (
                    <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {model.description}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete conversation */}
        {activeConversationId && (
          <Tooltip>
            <TooltipTrigger
              className={`${iconTriggerClass} text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10`}
              onClick={() => deleteConversation(activeConversationId)}
            >
              <Trash2Icon className="h-3.5 w-3.5" />
            </TooltipTrigger>
            <TooltipContent>Supprimer la conversation</TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger
            className={`${iconTriggerClass} text-muted-foreground/50 hover:text-foreground hover:bg-white/5 opacity-50 cursor-not-allowed`}
          >
            <SettingsIcon className="h-3.5 w-3.5" />
          </TooltipTrigger>
          <TooltipContent>Paramètres (bientôt)</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
