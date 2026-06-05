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
          "flex flex-shrink-0 border-r border-border bg-white overflow-hidden transition-all duration-300 shadow-sm",
          sidebarOpen ? "w-[17rem]" : "w-14"
        )}
      >
        <Sidebar />
      </aside>

      {/* Main */}
      <main className="flex flex-col flex-1 min-w-0 bg-background">
        <ChatHeader />
        <ChatArea />
      </main>
    </div>
  );
}
