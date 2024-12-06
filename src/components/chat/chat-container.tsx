import React from "react";
import { Chat } from "./chat";
import { ChatProvider } from "~/lib/nostr/chat-provider";
import { env } from "~/env";

interface ChatContainerProps {
  roomId: string;
}

export function ChatContainer({ roomId }: ChatContainerProps) {
  return (
    <ChatProvider>
      <div className="flex flex-col items-center justify-center gap-4 h-[600px]">
        <div className="z-10 h-full w-full max-w-5xl border border-primary/50 rounded-md text-sm lg:flex">
          <Chat roomId={`${env.NEXT_PUBLIC_CHAT_PREFIX}-${roomId}`} />
        </div>
      </div>
    </ChatProvider>
  );
}
