"use client";

import { AGENTS, AgentConfig, AgentId } from "@/config/agents";
import { useChatStore } from "@/store/chat-store";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

interface AgentSelectorProps {
  compact?: boolean;
  onSelect?: () => void;
}

export function AgentSelector({ compact, onSelect }: AgentSelectorProps) {
  const { selectedAgentId, setAgent, createConversation } = useChatStore();

  const handleSelect = (agent: AgentConfig) => {
    setAgent(agent.id as AgentId);
    createConversation();
    onSelect?.();
  };

  if (compact) {
    return (
      <div className="flex flex-col gap-0.5 px-2 py-1">
        {AGENTS.map((agent) => (
          <button
            key={agent.id}
            onClick={() => handleSelect(agent)}
            className={cn(
              "flex items-center gap-2.5 w-full rounded-xl px-3 py-2 text-left transition-all duration-150",
              selectedAgentId === agent.id
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
            )}
          >
            {/* Avatar compact */}
            <div
              className="h-7 w-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ background: agent.bgColor }}
            >
              {agent.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{agent.shortName}</p>
            </div>
            {selectedAgentId === agent.id && (
              <div className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: agent.bgColor }} />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 w-full max-w-2xl mx-auto">
      {AGENTS.map((agent) => {
        const isSelected = selectedAgentId === agent.id;
        return (
          <button
            key={agent.id}
            onClick={() => handleSelect(agent)}
            className={cn(
              "group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-200 text-left",
              isSelected
                ? "border-2 bg-white shadow-card"
                : "border-border bg-white hover:shadow-card-hover hover:-translate-y-0.5"
            )}
            style={isSelected ? { borderColor: agent.bgColor } : {}}
          >
            {/* Avatar */}
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
              style={{ background: agent.bgColor }}
            >
              {agent.emoji}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-foreground">{agent.name}</p>
                {isSelected && (
                  <div
                    className="h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: agent.bgColor }}
                  >
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{agent.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {agent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: `${agent.bgColor}18`,
                      color: agent.bgColor,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function CurrentAgentBadge() {
  const { selectedAgentId } = useChatStore();
  const agent = AGENTS.find((a) => a.id === selectedAgentId) ?? AGENTS[0];

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="h-5 w-5 rounded-md flex items-center justify-center text-xs"
        style={{ background: agent.bgColor }}
      >
        {agent.emoji}
      </div>
      <span className="text-xs font-medium text-muted-foreground">
        {agent.shortName}
      </span>
    </div>
  );
}
