

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useWallet } from "@meshsdk/react";
import { useState } from "react";
import BurnModuleTokens from "./BurnModuleTokens";
import { type CourseModuleOverview } from "~/types/db";

export default function BurnModuleTokensDialog({
  accessTokenAssetId,
  courseNftPolicyId,
  courseModuleOverview,
}: {
  accessTokenAssetId: string;
  courseNftPolicyId: string;
  courseModuleOverview: CourseModuleOverview
}) {
  const { connected } = useWallet();
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(undefined);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button intent="dialog" size="dialog" className="mx-auto">
            Burn Module Token
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-7xl border-l-[10px] border-secondary">
          <div className="grid grid-cols-2 gap-8">
            <div className="p-2">
              <DialogHeader>
                <DialogTitle>Burn (remove) Module Token</DialogTitle>
                <DialogDescription>
                  Disable the on-chain credential for this course module by burning the module token
                </DialogDescription>
              </DialogHeader>
              {!connected && "Please connect a wallet."}
              {!!connected &&
                "Press Commit to sign the transaction."}

              <DialogFooter>
                <p className="pt-5 text-xs font-bold">
                  Learn more...
                </p>
              </DialogFooter>
            </div>
            <div className="p-2">
              <BurnModuleTokens
                accessTokenAssetId={accessTokenAssetId}
                courseNftPolicyId={courseNftPolicyId}
                courseModuleOverview={courseModuleOverview}
                setSuccessTxHash={setSuccessTxHash}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
