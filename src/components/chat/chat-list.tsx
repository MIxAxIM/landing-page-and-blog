import { cn } from "~/utils/shadcn";
import { useRef, useEffect } from "react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import ChatBottombar from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "~/utils/api";
import useNostrChat from "~/lib/nostr/chat-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { FaceSmileIcon } from "@heroicons/react/24/outline";

export function ChatList() {
  const { messages, nostrChatUser } = useNostrChat();

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <TooltipProvider>
      <div className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden">
        <div
          ref={messagesContainerRef}
          className="flex h-full w-full flex-col overflow-y-auto overflow-x-hidden"
        >
          <AnimatePresence>
            {messages &&
              messages.length > 0 &&
              [...new Set(messages)]
                .sort((a, b) => a.timestamp! - b.timestamp!)
                .map((message, index) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                    transition={{
                      opacity: { duration: 0.1 },
                      layout: {
                        type: "spring",
                        bounce: 0.3,
                        duration: messages.indexOf(message) * 0.05 + 0.2,
                      },
                    }}
                    style={{
                      originX: 0.5,
                      originY: 0.5,
                    }}
                    className={cn(
                      "flex flex-col gap-2 whitespace-pre-wrap p-4",
                      message.pubkey === nostrChatUser?.pubkey
                        ? "items-end"
                        : "items-start",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {((nostrChatUser &&
                        message.pubkey !== nostrChatUser.pubkey) ??
                        nostrChatUser === undefined) && (
                          <UserAvatar pubkey={message.pubkey} />
                        )}
                      <ChatMessage message={message.message} />

                      {nostrChatUser &&
                        message.pubkey === nostrChatUser.pubkey && (
                          <UserAvatar pubkey={message.pubkey} />
                        )}
                    </div>
                  </motion.div>
                ))}
            {messages && messages.length === 0 && (
              <div className="flex h-full w-full flex-col justify-center overflow-y-auto overflow-x-hidden">
                <div className="flex flex-col items-center justify-center">
                  <FaceSmileIcon className="h-16 w-16" />
                  <span>No messages.</span>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
        <ChatBottombar />
      </div>
    </TooltipProvider>
  );
}

function UserAvatar({ pubkey }: { pubkey: string }) {
  const { data: user } = api.user.getUserByPubkey.useQuery({
    pubkey: pubkey,
  });

  if (user)
    return (
      <Tooltip>
        <TooltipTrigger>
          <Avatar className="flex items-center justify-center">
            <AvatarImage
              src={user.image ?? ""}
              alt={user.name ?? ""}
              width={4}
              height={4}
            />
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <p>{user.name}</p>
        </TooltipContent>
      </Tooltip>
    );

  return null;
}

function ChatMessage({ message }: { message: string }) {
  const isEmoji = /\p{Extended_Pictographic}/u.test(message);
  return (
    <span
      className={`max-w-sm rounded-sm bg-card px-2 py-1 shadow-md ${isEmoji && message.length == 2 ? `text-3xl` : `text-sm`}`}
    >
      {message}
    </span>
  );
}
