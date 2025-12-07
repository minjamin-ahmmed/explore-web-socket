"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useChatContext } from "@/context/chat-context";
import { useAuth } from "@/context/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/theme/mode-toggle";
import { cn } from "@/lib/utils";

export function ChatHeader() {
  const router = useRouter();
  const { logout } = useAuth();
  const { conversations, activeConversationId } = useChatContext();
  const conversation = conversations.find((c) => c.id === activeConversationId);

  if (!conversation) {
    return null;
  }

  const [primaryParticipant] = conversation.participants;
  const initials = conversation.title
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/70 bg-linear-to-r from-background/95 via-background to-background/95 px-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="text-[0.7rem] font-semibold uppercase">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">{conversation.title}</span>
          <span className="text-[0.7rem] text-muted-foreground">
            {primaryParticipant?.isOnline
              ? "Online"
              : primaryParticipant?.lastSeen
              ? `Last seen ${primaryParticipant.lastSeen}`
              : "Last active recently"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="hidden rounded-full border border-border/60 px-3 text-[0.7rem] font-medium text-muted-foreground hover:bg-accent sm:inline-flex"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
        >
          Logout
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <span className="sr-only">Open conversation menu</span>
              <span className="text-lg leading-none text-muted-foreground">
                ···
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className={cn("text-xs")}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              Mute notifications
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs text-destructive">
              Leave channel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ModeToggle />
      </div>
    </header>
  );
}


