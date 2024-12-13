import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useWallet } from "@meshsdk/react";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import SuccessTxModalContent from "~/components/cardano/common/SuccessTxComponent";
import AddInfo from "./AddInfo";
import ConnectWalletCard from "~/components/cardano/common/ConnectWalletCard";

export default function AddInfoDialog({
  taskCommitmentId,
  treasuryNftPolicyId,
  evidenceInfoString,
}: {
  taskCommitmentId: string;
  treasuryNftPolicyId?: string;
  evidenceInfoString?: string;
}) {
  const { connected } = useWallet();
  const { accessTokenAsset } = useAccessToken();
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  console.log("Add Info Dialog", taskCommitmentId, treasuryNftPolicyId, evidenceInfoString);

  const nextSteps = [
    {
      text: `View Project Tasks`,
      url: `/projects`,
    },
    { text: "Browse all Projects", url: "/projects" },
  ];

  return (
    <>
      {!connected ? (
        <ConnectWalletCard message="Please connect a wallet" />
      ) : (
        <Dialog>
          <DialogTrigger>
            <Button>Add Commitment Evidence</Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl border-l-[10px] border-secondary">
            <div className="grid grid-cols-2 gap-8">
              <div className="p-2">
                {successTxHash ? (
                  <SuccessTxModalContent
                    txName="Successfully added Commitment Info"
                    nextStepLinks={nextSteps}
                    txHash={successTxHash}
                  />
                ) : (
                  <DialogHeader>
                    <p>You will submit evidence...</p>
                  </DialogHeader>
                )}
              </div>

              <div className="p-2">
                {!!evidenceInfoString && (
                  <>
                    {accessTokenAsset &&
                      !!treasuryNftPolicyId && (
                        <AddInfo
                          taskCommitmentId={taskCommitmentId}
                          treasuryNftPolicyId={treasuryNftPolicyId ?? ""}
                          setSuccessTxHash={setSuccessTxHash}
                          info={evidenceInfoString}
                        />
                      )}
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
