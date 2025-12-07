"use client";

import * as React from "react";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChatProvider } from "@/context/chat-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function ChatLayout() {
  return (
    <ChatProvider>
      <div className="flex min-h-screen items-stretch justify-center px-3 py-4 text-foreground sm:px-4 sm:py-6">
        <motion.div
          className={cn(
            "app-shell-card flex w-full max-w-6xl flex-1 overflow-hidden rounded-3xl border border-border/70 shadow-soft-elevated"
          )}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          layout
        >
          <DesktopShell />
        </motion.div>
      </div>
    </ChatProvider>
  );
}

function DesktopShell() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <>
      {/* Sidebar - desktop */}
      <div className="hidden w-[280px] flex-none border-r border-border/70 bg-background/90 lg:flex">
        <ChatSidebar />
      </div>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-border/70 bg-background/90 px-3 py-2 lg:hidden">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <span className="sr-only">Open sidebar</span>
                <span className="text-lg leading-none">☰</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] p-0">
              <ChatSidebar onConversationSelected={() => setIsSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            WarmChat
          </span>
          <div className="w-9" />
        </div>

        {/* Chat header */}
        <ChatHeader />

        {/* Messages */}
        <div className="flex min-h-0 flex-1 flex-col bg-linear-to-b from-background via-background/95 to-background/90">
          <MessageList />
          <div className="border-t border-border/70 px-3 pb-3 pt-2 sm:px-4 sm:pb-4 sm:pt-3">
            <MessageInput />
          </div>
        </div>
      </div>
    </>
  );
}


