import React, { useRef } from "react";
import { motion } from "framer-motion";

// Define specific words we want to color
type ColoredWord =
  | "short"
  | "targeted"
  | "courses"
  | "complete"
  | "real"
  | "tasks"
  | "payments"
  | "instant"
  | "secure"
  | "professional"
  | "reputation";

// Define word-color mapping
const wordColors: Record<ColoredWord, string> = {
  short: "text-secondary",
  targeted: "text-secondary",
  courses: "text-secondary",
  complete: "text-secondary",
  real: "text-secondary",
  tasks: "text-secondary",
  payments: "text-secondary",
  instant: "text-secondary",
  secure: "text-secondary",
  professional: "text-secondary",
  reputation: "text-secondary",
};

export function HowAndamioWorks() {
  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const sentences = [
    "Quickly develop new skills with targeted courses.",
    "Apply new skills to real tasks.",
    "Receive instant, secure payments via smart contracts.",
    "Build your reputation with every on-chain contribution.",
  ];

  return (
    <section className="relative mx-auto w-full px-4">
      {sentences.map((sentence, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) sectionsRef.current[index] = el;
          }}
          className="sentence-container flex min-h-screen items-center justify-start px-8"
        >
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="text-3xl font-black text-primary md:text-5xl lg:text-6xl"
          >
            {sentence.split(" ").map((word, idx) => {
              const normalizedWord = normalizeWord(word);
              const colorClass = normalizedWord in wordColors
                ? wordColors[normalizedWord as ColoredWord]
                : "text-primary";

              return (
                <motion.span
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className={`inline-block ${colorClass}`}
                >
                  {word}&nbsp;
                </motion.span>
              );
            })}
          </motion.h2>
        </div>
      ))}
    </section>
  );
}

// Helper function
const normalizeWord = (word: string): string =>
  word
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .trim();
