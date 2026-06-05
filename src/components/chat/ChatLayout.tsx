"use client";

import { useChatStore } from "@/store/chat-store";
import { Sidebar } from "./Sidebar";
import { ChatArea } from "./ChatArea";
import { ChatHeader } from "./ChatHeader";
import { cn } from "@/lib/utils";

export function ChatLayout() {
  const { sidebarOpen } = useChatStore();

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-shrink-0 border-r border-white/8 bg-card/50 overflow-hidden transition-all duration-300",
          sidebarOpen ? "w-[17.5rem]" : "w-14"
        )}
      >
        <Sidebar />
      </aside>

      {/* Main chat area */}
      <main className="flex flex-col flex-1 min-w-0">
        <ChatHeader />
        <ChatArea />
      </main>
    </div>
  );
}
