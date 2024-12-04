import { Button } from "~/components/ui/button";
import { type OnboardingStatus } from "@prisma/client";
import { motion } from "framer-motion";

type RoleStatus = {
  id: string;
  userId: string;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  onboardingStatus: OnboardingStatus | null;
  onboardingCompletedAt: Date | null;
} | null | undefined

interface OnboardRoleProps {
  title: string;
  cta: string;
  roleStatus: RoleStatus
  enableRole: () => void;
  updateRoleStatus: (id: string, status: OnboardingStatus) => void;
  FirstStepContent?: React.ComponentType;
  NextStepContent?: React.ComponentType;
  CompletedContent?: React.ComponentType;
}

export default function OnboardRole({
  title,
  cta,
  roleStatus,
  enableRole,
  updateRoleStatus,
  FirstStepContent,
  NextStepContent,
  CompletedContent
}: OnboardRoleProps) {
  const duration = 0.4
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {
          scaleY: 0,
          originY: 0.5,
          backgroundColor: "rgba(0, 0, 0, 0)",
        },
        visible: {
          scaleY: 1,
          transition: {
            duration: duration,
            ease: "easeOut",
            staggerChildren: 0.1,
          },
        },
      }}
      className="flex flex-row justify-between items-center w-full min-w-7xl h-full bg-background border border-primary p-5 pb-10 rounded-sm gap-x-10 mb-24"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, x: -20 },
          visible: {
            opacity: 1,
            x: 0,
            transition: { duration: duration }
          }
        }}
        className="flex flex-col w-full space-y-4"
      >
        <motion.h1
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="prose-h1 text-2xl"
        >
          {title}
        </motion.h1>

        {(roleStatus?.onboardingStatus === "NOT_STARTED" || roleStatus?.onboardingStatus === "PARTIAL") && (
          <p>{cta}</p>

        )}


        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: duration * 2 }
            },
          }}
        >
          {roleStatus?.onboardingStatus === "NOT_STARTED" && (
            <div>
              <div className="my-5 text-lg font-semibold">Try it:</div>
              {FirstStepContent && <FirstStepContent />}
            </div>
          )}

          {roleStatus?.onboardingStatus === "PARTIAL" && (
            <div className="space-y-2">
              <h2>In Progress</h2>
              {NextStepContent && <NextStepContent />}
              <Button onClick={() => updateRoleStatus(roleStatus.id, "COMPLETE")}>Thanks! I&apos;ve got this on my own now.</Button>
            </div>
          )}

          {(roleStatus?.onboardingStatus === "SKIPPED" ||
            roleStatus?.onboardingStatus === "COMPLETE") && (
              <div className="space-y-2">
                {CompletedContent && <CompletedContent />}
                <Button onClick={() => updateRoleStatus(roleStatus.id, "NOT_STARTED")}>Try the interactive tutorial again</Button>
              </div>
            )}

          {!roleStatus && (
            <Button onClick={enableRole}>Get Started</Button>
          )}
        </motion.div>
      </motion.div>

    </motion.div>
  );
}
