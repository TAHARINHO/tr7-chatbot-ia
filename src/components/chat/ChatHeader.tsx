"use client";

import { useChatStore } from "@/store/chat-store";
import { MODELS, AIModel } from "@/types/chat";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon, Trash2Icon, SparklesIcon, ZapIcon } from "lucide-react";

const iconBtn = "inline-flex h-8 w-8 items-center justify-center rounded-xl transition-colors focus-visible:outline-none";

export function ChatHeader() {
  const { selectedModel, setModel, activeConversationId, deleteConversation, getActiveConversation } = useChatStore();
  const currentModel = MODELS.find((m) => m.id === selectedModel) ?? MODELS[0];
  const activeConv = getActiveConversation();

  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-white/80 backdrop-blur-md flex-shrink-0">
      {/* Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <h1 className="text-sm font-semibold truncate text-foreground">
          {activeConv?.title ?? "Nouvelle conversation"}
        </h1>
        {activeConv && (
          <Badge variant="secondary" className="text-xs px-2 py-0 h-5 font-normal hidden sm:flex">
            {activeConv.messages.filter((m) => m.role === "user").length} messages
          </Badge>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Model selector */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-xl px-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none">
            <SparklesIcon className="h-3 w-3 text-violet-500" />
            {currentModel.name}
            <ChevronDownIcon className="h-3 w-3 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-68 bg-white border-border shadow-card-hover">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal pb-1">
              Choisir un modèle Claude
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {MODELS.map((model) => (
              <DropdownMenuItem
                key={model.id}
                onClick={() => setModel(model.id as AIModel)}
                className={cn("flex items-start gap-3 py-2.5 cursor-pointer rounded-lg", selectedModel === model.id && "bg-violet-50")}
              >
                <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", selectedModel === model.id ? "bg-violet-100" : "bg-muted")}>
                  <ZapIcon className={cn("h-3.5 w-3.5", selectedModel === model.id ? "text-violet-600" : "text-muted-foreground")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{model.name}</span>
                    {model.badge && (
                      <Badge variant="secondary" className="h-4 text-xs px-1.5 bg-violet-100 text-violet-700 border-0">
                        {model.badge}
                      </Badge>
                    )}
                    {selectedModel === model.id && (
                      <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-500" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{model.description}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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

// cn helper inline (already imported via @/lib/utils in other files but ChatHeader needs it)
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
