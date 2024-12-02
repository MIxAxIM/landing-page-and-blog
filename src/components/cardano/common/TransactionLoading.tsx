import { type BrowserWallet } from "@meshsdk/wallet";
import { useEffect, useState } from "react";
import { Progress } from "~/components/ui/progress";

export default function TransactionLoading({
  wallet,
}: {
  wallet: BrowserWallet;
}) {
  const [progress, setProgress] = useState<number>(0);
  const [loadingMessage, setLoadingMessage] = useState<string>(
    "Getting collateral...",
  );
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    async function fetchCollateral() {
      try {
        const _c = await wallet.getCollateral();
        if (_c) {
          setProgress(10);
          setLoadingMessage("Gathering UTxOs...");
          intervalId = setInterval(() => {
            setProgress((prevProgress) => {
              if (prevProgress < 33) {
                setLoadingMessage("Gathering UTxOs...");
                return 33;
              } else if (prevProgress < 67) {
                setLoadingMessage("Building transaction...");
                return 67;
              } else if (prevProgress < 100) {
                setLoadingMessage("Preparing for signature...");
                return 90;
              } else {
                if (intervalId) clearInterval(intervalId);
                return prevProgress;
              }
            });
          }, 1000);
        } else {
          setError(
            "Your wallet does not have collateral set. Please check wallet settings and try again.",
          );
        }
      } catch (err) {
        setError("An error occurred");
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
      <div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col">
      <p className="py-3 text-base">{loadingMessage}</p>
      <Progress value={progress} />
    </div>
  );
}
