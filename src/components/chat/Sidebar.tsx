"use client";

import { useChatStore } from "@/store/chat-store";
import { Conversation } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PlusIcon,
  MessageSquareIcon,
  Trash2Icon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SparklesIcon,
} from "lucide-react";
import { formatDistanceToNow } from "@/lib/date-utils";

const triggerClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors";

export function Sidebar() {
  const {
    conversations,
    activeConversationId,
    sidebarOpen,
    createConversation,
    selectConversation,
    deleteConversation,
    toggleSidebar,
  } = useChatStore();

  return (
    <>
      {/* Toggle + compact new-chat buttons */}
      <div className="flex flex-shrink-0 flex-col items-center pt-4 gap-2 px-2">
        <Tooltip>
          <TooltipTrigger className={triggerClass} onClick={toggleSidebar}>
            {sidebarOpen ? (
              <PanelLeftCloseIcon className="h-4 w-4" />
            ) : (
              <PanelLeftOpenIcon className="h-4 w-4" />
            )}
          </TooltipTrigger>
          <TooltipContent side="right">
            {sidebarOpen ? "Fermer le panneau" : "Ouvrir le panneau"}
          </TooltipContent>
        </Tooltip>

        {!sidebarOpen && (
          <Tooltip>
            <TooltipTrigger
              className={triggerClass}
              onClick={() => createConversation()}
            >
              <PlusIcon className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent side="right">Nouvelle conversation</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Expanded sidebar */}
      <div
        className={cn(
          "flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0"
        )}
      >
        {/* Logo + new button */}
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
              <SparklesIcon className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-semibold text-sm tracking-wide">TR7 Chat</span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-white/5"
            onClick={() => createConversation()}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        <Separator className="opacity-50" />

        {/* Conversations list */}
        <ScrollArea className="flex-1 px-2 py-2 scrollbar-thin">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <MessageSquareIcon className="h-8 w-8 text-muted-foreground/40 mb-3" />
              <p className="text-xs text-muted-foreground/60">
                Aucune conversation
              </p>
              <p className="text-xs text-muted-foreground/40 mt-1">
                Cliquez sur + pour commencer
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isActive={conv.id === activeConversationId}
                  onSelect={() => selectConversation(conv.id)}
                  onDelete={() => deleteConversation(conv.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        <Separator className="opacity-50" />

        {/* Footer */}
        <div className="px-4 py-3">
          <p className="text-xs text-muted-foreground/40 text-center">
            Propulsé par Claude · TR7
          </p>
        </div>
      </div>
    </>
  );
}

function ConversationItem({
  conv,
  isActive,
  onSelect,
  onDelete,
}: {
  conv: Conversation;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const lastMsg = conv.messages[conv.messages.length - 1];

  return (
    <div
      className={cn(
        "group relative flex items-start gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-all duration-150",
        isActive
          ? "bg-white/8 text-foreground"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
      )}
      onClick={onSelect}
    >
      {isActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-primary" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate leading-snug">{conv.title}</p>
        {lastMsg && (
          <p className="text-xs text-muted-foreground/50 truncate mt-0.5 leading-snug">
            {lastMsg.content.slice(0, 40)}
            {lastMsg.content.length > 40 ? "…" : ""}
          </p>
        )}
        <p className="text-xs text-muted-foreground/30 mt-0.5">
          {formatDistanceToNow(conv.updatedAt)}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-muted-foreground/50 hover:text-destructive flex-shrink-0 mt-0.5"
      >
        <Trash2Icon className="h-3 w-3" />
      </button>
    </div>
  );
}
