"use client";

import { useChatStore } from "@/store/chat-store";
import { Conversation } from "@/types/chat";
import { AGENTS, AgentId, AgentCategory, AGENT_CATEGORIES, getAgentsByCategory } from "@/config/agents";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PlusIcon, MessageSquareIcon, Trash2Icon, PanelLeftCloseIcon, PanelLeftOpenIcon, ChevronDownIcon, HomeIcon } from "lucide-react";
import { formatDistanceToNow } from "@/lib/date-utils";
import { useState } from "react";
import Link from "next/link";
import { InayaAvatar } from "./Avatars";

const iconBtn = "inline-flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none";

const CATEGORY_ORDER: AgentCategory[] = ["general", "management", "contenu", "business", "technique", "rh"];

export function Sidebar() {
  const {
    conversations, activeConversationId, sidebarOpen, selectedAgentId,
    createConversation, selectConversation, deleteConversation, toggleSidebar, setAgent,
  } = useChatStore();

  const [collapsedCategories, setCollapsedCategories] = useState<Set<AgentCategory>>(new Set());

  const currentAgent = AGENTS.find((a) => a.id === selectedAgentId) ?? AGENTS[0];

  const toggleCategory = (cat: AgentCategory) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // Navigation vers la page de l'agent (avec router push)
  const handleSelectAgent = (id: AgentId) => {
    setAgent(id);
    // La navigation est gérée par le Link dans le render
  };

  return (
    <>
      {/* Collapsed strip */}
      <div className="flex flex-shrink-0 flex-col items-center pt-3 gap-1 px-2">
        <Tooltip>
          <TooltipTrigger className={iconBtn} onClick={toggleSidebar}>
            {sidebarOpen ? <PanelLeftCloseIcon className="h-4 w-4" /> : <PanelLeftOpenIcon className="h-4 w-4" />}
          </TooltipTrigger>
          <TooltipContent side="right">{sidebarOpen ? "Réduire" : "Ouvrir"}</TooltipContent>
        </Tooltip>

        {!sidebarOpen && (
          <>
            {/* Retour dashboard */}
            <Tooltip>
              <TooltipTrigger className={iconBtn} onClick={() => {}}>
                <Link href="/" className="flex items-center justify-center w-full h-full">
                  <HomeIcon className="h-4 w-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Accueil agents</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger className={iconBtn} onClick={() => createConversation()}>
                <PlusIcon className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent side="right">Nouvelle conversation</TooltipContent>
            </Tooltip>
            {/* Agents compacts */}
            <div className="mt-1 flex flex-col gap-0.5 items-center">
              {AGENTS.map((agent) => (
                <Tooltip key={agent.id}>
                  <TooltipTrigger className="focus-visible:outline-none">
                    <Link
                      href={`/agent/${agent.id}`}
                      className={cn(
                        "h-7 w-7 rounded-lg flex items-center justify-center text-xs transition-all",
                        selectedAgentId === agent.id ? "opacity-100" : "opacity-50 hover:opacity-90"
                      )}
                      style={{ background: agent.persona ? "transparent" : agent.bgColor }}
                      onClick={() => handleSelectAgent(agent.id)}
                    >
                      {agent.persona ? (
                        <InayaAvatar persona={agent.persona} size="xs" />
                      ) : (
                        <span className="text-white text-xs">{agent.emoji}</span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{agent.persona?.name ?? agent.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Expanded panel */}
      <div className={cn(
        "flex flex-col overflow-hidden transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0 pointer-events-none"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            {/* Bouton retour dashboard */}
            <Link href="/" className={cn(iconBtn, "flex-shrink-0")}>
              <HomeIcon className="h-4 w-4" />
            </Link>
            {currentAgent.persona ? (
              <InayaAvatar persona={currentAgent.persona} size="sm" />
            ) : (
              <div
                className="h-8 w-8 rounded-xl flex items-center justify-center text-lg flex-shrink-0 shadow-sm"
                style={{ background: currentAgent.bgColor }}
              >
                {currentAgent.emoji}
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-foreground leading-tight">
                {currentAgent.persona?.name ?? currentAgent.name}
              </p>
              <p className="text-xs text-muted-foreground">TR7 Agents IA</p>
            </div>
          </div>
          <Button
            size="icon" variant="ghost"
            className="h-8 w-8 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent"
            onClick={() => createConversation()}
          >
            <PlusIcon className="h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="mx-4 h-px bg-border flex-shrink-0" />

        {/* Scrollable content: agents + conversations */}
        <ScrollArea className="flex-1 scrollbar-thin">
          <div className="px-2 pb-2">
            {/* Agents par catégorie */}
            {CATEGORY_ORDER.map((cat) => {
              const catAgents = getAgentsByCategory(cat);
              if (catAgents.length === 0) return null;
              const catInfo = AGENT_CATEGORIES[cat];
              const isCollapsed = collapsedCategories.has(cat);

              return (
                <div key={cat} className="mb-1">
                  {/* Category header */}
                  <button
                    onClick={() => toggleCategory(cat)}
                    className="flex items-center gap-1.5 w-full px-2 py-1.5 text-left group"
                  >
                    <span className={`text-[10px] font-bold uppercase tracking-wider flex-1 ${catInfo.color}`}>
                      {catInfo.label}
                    </span>
                    <ChevronDownIcon
                      className={cn("h-3 w-3 text-muted-foreground/50 transition-transform", isCollapsed && "-rotate-90")}
                    />
                  </button>

                  {/* Agents de la catégorie — naviguer vers la page dédiée */}
                  {!isCollapsed && (
                    <div className="space-y-0.5">
                      {catAgents.map((agent) => {
                        const isActive = selectedAgentId === agent.id;
                        const displayName = agent.persona?.name ?? agent.name;
                        return (
                          <Link
                            key={agent.id}
                            href={`/agent/${agent.id}`}
                            onClick={() => handleSelectAgent(agent.id)}
                            className={cn(
                              "flex items-center gap-2 w-full rounded-xl px-2.5 py-1.5 text-left transition-all duration-150",
                              isActive
                                ? "bg-accent text-foreground"
                                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                            )}
                          >
                            {agent.persona ? (
                              <InayaAvatar persona={agent.persona} size="xs" />
                            ) : (
                              <div
                                className="h-6 w-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                                style={{ background: agent.bgColor }}
                              >
                                {agent.emoji}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate leading-tight">{displayName}</p>
                            </div>
                            {isActive && (
                              <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: agent.bgColor }} />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Séparateur Conversations */}
            <div className="h-px bg-border my-2" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
              Conversations
            </p>

            {conversations.length === 0 ? (
              <div className="flex flex-col items-center py-6 px-4 text-center">
                <MessageSquareIcon className="h-4 w-4 text-muted-foreground mb-1.5" />
                <p className="text-xs text-muted-foreground">Aucune conversation</p>
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
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="flex-shrink-0">
          <div className="mx-4 h-px bg-border" />
          <div className="px-4 py-2.5">
            <p className="text-[10px] text-muted-foreground/50 text-center">
              {AGENTS.length} agents · Propulsé par TR7
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function ConversationItem({ conv, isActive, onSelect, onDelete }: {
  conv: Conversation; isActive: boolean; onSelect: () => void; onDelete: () => void;
}) {
  const lastMsg = conv.messages[conv.messages.length - 1];
  return (
    <div
      className={cn(
        "group relative flex items-start gap-2 rounded-xl px-2.5 py-2 cursor-pointer transition-all duration-150",
        isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
      onClick={onSelect}
    >
      {isActive && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-full bg-violet-500" />
      )}
      <MessageSquareIcon className={cn("h-3 w-3 flex-shrink-0 mt-0.5", isActive ? "text-violet-500" : "text-muted-foreground/50")} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold truncate">{conv.title}</p>
        {lastMsg && (
          <p className="text-xs text-muted-foreground/60 truncate mt-0.5">
            {lastMsg.content.slice(0, 30)}{lastMsg.content.length > 30 ? "…" : ""}
          </p>
        )}
        <p className="text-xs text-muted-foreground/40 mt-0.5">{formatDistanceToNow(conv.updatedAt)}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-lg text-muted-foreground/40 hover:text-red-500 flex-shrink-0"
      >
        <Trash2Icon className="h-3 w-3" />
      </button>
    </div>
  );
}
