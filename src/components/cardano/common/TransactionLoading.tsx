import { type IWallet } from "@meshsdk/core";
import { useState, useEffect } from "react";
import { Progress } from "~/components/ui/progress";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingStage {
  message: string;
  progress: number;
}

const LOADING_STAGES: LoadingStage[] = [
  { message: "Getting collateral...", progress: 3 },
  { message: "Checking Andamio Network status...", progress: 17 },
  { message: "Gathering UTxOs...", progress: 33 },
  { message: "Building transaction...", progress: 67 },
  { message: "Preparing for signature...", progress: 90 }
];

export default function TransactionLoading({
  wallet,
  className
}: {
  wallet: IWallet;
  className?: string;
}) {
  const [progress, setProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    async function fetchCollateral() {
      try {
        const collateral = await wallet.getCollateral();

        if (!collateral) {
          setError("Your wallet does not have collateral set. Please check wallet settings and try again.");
          return;
        }

        if (LOADING_STAGES.length > 0) {
          setProgress(LOADING_STAGES[0]!.progress);
        }

        intervalId = setInterval(() => {
          setCurrentStage(prev => {
            const nextStage = prev + 1;
            if (nextStage >= LOADING_STAGES.length) {
              if (intervalId) clearInterval(intervalId);
              return prev;
            }
            setProgress(LOADING_STAGES[nextStage]!.progress);
            return nextStage;
          });
        }, 1000);

      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while processing your transaction");
      }
    }

    if (wallet) {
      void fetchCollateral();
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [wallet]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={className}>
      <div className="my-6">
        <div className="flex flex-col gap-4">
          <div className="relative h-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={currentStage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute text-base text-muted-foreground"
              >
                {LOADING_STAGES[currentStage]?.message ?? "Checking..."}
              </motion.p>
            </AnimatePresence>
          </div>
          <Progress
            value={progress}
            className="h-2 w-full transition-all"
          />
        </div>
      </div>
    </div>
  );
}
