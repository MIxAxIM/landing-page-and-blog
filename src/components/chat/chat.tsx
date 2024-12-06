import useNostrChat from "~/lib/nostr/chat-provider";
import { ChatList } from "./chat-list";
import React, { useEffect, useRef } from "react";

interface ChatProps {
  roomId: string;
}

export function Chat({ roomId }: ChatProps) {
  const { subscribeRoom } = useNostrChat();
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    subscribeRoom(roomId);
    loaded.current = true;
  }, [roomId, subscribeRoom]);

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-md bg-background/40">
      <ChatList />
    </div>
  );
}
