import { FileImage, Paperclip, SendHorizontal, ThumbsUp } from "lucide-react";
import React, { useRef, useState } from "react";
import { buttonVariants } from "../ui/button";
import { cn } from "~/utils/shadcn";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Textarea } from "../ui/textarea";
import { EmojiPicker } from "./emoji-picker";
import useNostrChat from "~/lib/nostr/chat-provider";

export const BottombarIcons = [{ icon: FileImage }, { icon: Paperclip }];

export default function ChatBottombar() {
  const { userConnected, publishMessage } = useNostrChat();

  const [message, setMessage] = useState("");
  const [lastMessageSent, setLastMessageSent] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const checkIfCanSend = () => {
    const currentTime = new Date().getTime();
    if (currentTime - lastMessageSent < 10000) {
      void shake();
      return false;
    } else {
      setLastMessageSent(currentTime);
      return true;
    }
  };

  const handleThumbsUp = () => {
    if (!userConnected) return;

    if (checkIfCanSend()) {
      publishMessage("👍");
      setMessage("");
    }
  };

  const handleSend = () => {
    if (!userConnected) return;

    if (checkIfCanSend()) {
      if (message.trim().length > 0) {
        publishMessage(message.trim());
        setMessage("");

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  // shake motion

  const controls = useAnimation();
  const getRandomDelay = () => -(Math.random() * 0.7 + 0.05);
  const randomDuration = () => Math.random() * 0.07 + 0.23;
  const variants = {
    start: (i: any) => ({
      rotate: i % 2 === 0 ? [-1, 1.3, 0] : [1, -1.4, 0],
      transition: {
        delay: getRandomDelay(),
        repeat: Infinity,
        duration: randomDuration(),
      },
    }),
    reset: {
      rotate: 0,
    },
  };
  const getRandomTransformOrigin = () => {
    const value = (16 + 40 * Math.random()) / 100;
    const value2 = (15 + 36 * Math.random()) / 100;
    return {
      originX: value,
      originY: value2,
    };
  };

  async function shake() {
    await controls.start("start");

    setTimeout(() => {
      controls.stop();
      controls.set("reset");
    }, 1000);
  }

  if (!userConnected) return null;

  return (
    <div className="flex w-full items-center justify-between gap-2 p-2">
      <AnimatePresence initial={false}>
        <motion.div
          key="input"
          className="relative w-full"
          layout
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{
            opacity: { duration: 0.05 },
            layout: {
              type: "spring",
              bounce: 0.15,
            },
          }}
        >
          <motion.div
            style={{
              ...getRandomTransformOrigin(),
            }}
            variants={variants}
            animate={controls}
          >
            <Textarea
              autoComplete="off"
              value={message}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              name="message"
              placeholder="Aa"
              className=" flex h-9 w-full resize-none items-center overflow-hidden rounded-full border border-slate-300 bg-card"
            ></Textarea>
            <div className="absolute bottom-0.5 right-2">
              <EmojiPicker
                onChange={(value) => {
                  setMessage(message + value);
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        {message.trim() ? (
          <button
            className={cn(
              buttonVariants({ intent: "ghost", size: "icon" }),
              "h-9 w-9",
              "shrink-0 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
            )}
            onClick={handleSend}
          >
            <SendHorizontal size={20} className="text-muted-foreground" />
          </button>
        ) : (
          <button
            className={cn(
              buttonVariants({ intent: "ghost", size: "icon" }),
              "h-9 w-9",
              "shrink-0 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
            )}
            onClick={handleThumbsUp}
          >
            <ThumbsUp size={20} className="text-muted-foreground" />
          </button>
        )}
      </AnimatePresence>
    </div>
  );
}
