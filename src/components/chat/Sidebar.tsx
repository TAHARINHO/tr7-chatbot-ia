"use client";

import { useChatStore } from "@/store/chat-store";
import { Conversation } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PlusIcon, MessageSquareIcon, Trash2Icon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { formatDistanceToNow } from "@/lib/date-utils";
import { AIAvatar } from "./Avatars";

const iconBtn = "inline-flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none";

export function Sidebar() {
  const {
    conversations, activeConversationId, sidebarOpen,
    createConversation, selectConversation, deleteConversation, toggleSidebar,
  } = useChatStore();

  return (
    <>
      {/* Collapsed strip */}
      <div className="flex flex-shrink-0 flex-col items-center pt-3 gap-1 px-2">
        <Tooltip>
          <TooltipTrigger className={iconBtn} onClick={toggleSidebar}>
            {sidebarOpen
              ? <PanelLeftCloseIcon className="h-4 w-4" />
              : <PanelLeftOpenIcon className="h-4 w-4" />}
          </TooltipTrigger>
          <TooltipContent side="right">
            {sidebarOpen ? "Réduire" : "Ouvrir"}
          </TooltipContent>
        </Tooltip>

        {!sidebarOpen && (
          <Tooltip>
            <TooltipTrigger className={iconBtn} onClick={() => createConversation()}>
              <PlusIcon className="h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent side="right">Nouvelle conversation</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Expanded panel */}
      <div className={cn(
        "flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0 pointer-events-none"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-2.5">
            <AIAvatar size="sm" />
            <div>
              <p className="text-sm font-bold text-foreground leading-tight">TR7 Chat</p>
              <p className="text-xs text-muted-foreground">Claude AI</p>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={() => createConversation()}
          >
            <PlusIcon className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Separator */}
        <div className="mx-4 h-px bg-border" />

        {/* Label */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Conversations
          </p>
        </div>

        {/* List */}
        <ScrollArea className="flex-1 px-2 pb-2 scrollbar-thin">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="h-12 w-12 rounded-2xl bg-accent flex items-center justify-center mb-3">
                <MessageSquareIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Aucune conversation</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Cliquez + pour commencer</p>
            </div>
          ) : (
            <div className="space-y-0.5 pt-1">
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

        {/* Footer */}
        <div className="mx-4 h-px bg-border" />
        <div className="px-4 py-3">
          <p className="text-xs text-muted-foreground/50 text-center">
            Propulsé par Claude · TR7 Agency
          </p>
        </div>
      </div>
    </>
  );
}

function ConversationItem({
  conv, isActive, onSelect, onDelete,
}: {
  conv: Conversation; isActive: boolean; onSelect: () => void; onDelete: () => void;
}) {
  const lastMsg = conv.messages[conv.messages.length - 1];

  return (
    <div
      className={cn(
        "group relative flex items-start gap-2.5 rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-150",
        isActive
          ? "bg-accent text-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
      )}
      onClick={onSelect}
    >
      {isActive && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 h-5 w-1 rounded-full bg-violet-500" />
      )}
      <MessageSquareIcon className={cn("h-3.5 w-3.5 flex-shrink-0 mt-0.5", isActive ? "text-violet-500" : "text-muted-foreground/50")} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate">{conv.title}</p>
        {lastMsg && (
          <p className="text-xs text-muted-foreground/60 truncate mt-0.5">
            {lastMsg.content.slice(0, 35)}{lastMsg.content.length > 35 ? "…" : ""}
          </p>
        )}
        <p className="text-xs text-muted-foreground/40 mt-0.5">
          {formatDistanceToNow(conv.updatedAt)}
        </p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg text-muted-foreground/40 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
      >
        <Trash2Icon className="h-3 w-3" />
      </button>
    </div>
  );
}
