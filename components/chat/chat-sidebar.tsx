"use client";

import * as React from "react";
import { useChatContext } from "@/context/chat-context";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type SidebarProps = {
  onConversationSelected?: () => void;
};

export function ChatSidebar({ onConversationSelected }: SidebarProps) {
  const { conversations, activeConversationId, setActiveConversationId } =
    useChatContext();

  return (
    <aside className="flex h-full w-full flex-col  bg-linear-to-b from-background to-background/95">
      <header className="flex items-center justify-between px-4 pb-3 pt-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Channels
          </span>
          <span className="text-sm font-semibold text-foreground">
            Conversations
          </span>
        </div>
      </header>
      <ScrollArea className="flex-1 px-2 pb-3">
        <div className="flex flex-col gap-1.5">
          {conversations.map((conversation) => {
            const isActive = conversation.id === activeConversationId;
            const initials = conversation.title
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => {
                  setActiveConversationId(conversation.id);
                  onConversationSelected?.();
                }}
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left text-sm transition-all",
                  "hover:bg-accent/80 hover:translate-y-[-1px]",
                  isActive &&
                    "bg-primary-soft/90 text-foreground shadow-sm"
                )}
              >
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className="text-[0.7rem] font-semibold uppercase">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[0.84rem] font-medium">
                      {conversation.title}
                    </span>
                    <span className="shrink-0 text-[0.68rem] font-medium text-muted-foreground">
                      {new Date(
                        conversation.lastMessageAt
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <p className="line-clamp-1 flex-1 text-[0.72rem] text-muted-foreground">
                      {conversation.lastMessagePreview}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="inline-flex h-5 min-w-[1.15rem] items-center justify-center rounded-full bg-primary/95 px-1 text-[0.65rem] font-semibold text-primary-foreground shadow-sm">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}

