import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import useGlobalStateDatum from "~/hooks/cardano-indexer-api/network/useGlobalStateDatum";
import SuccessTxModalContent from "~/components/cardano/common/SuccessTxComponent";
import MintProjectState from "./MintProjectState";
import useProjectByTreasury from "~/hooks/cardano-indexer-api/project/useProjectByTreasury";

// TODO: Check if this access token is enrolled (via Global State query)
// Delete checkIfEnrolled

export default function MintProjectStateDialog({
  treasuryNftPolicyId,
}: {
  treasuryNftPolicyId: string;
}) {
  const { connected } = useWallet();
  const { accessTokenAlias } = useAccessToken();
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const { contributorPolicies } = useProjectByTreasury({
    treasuryNftPolicyId: treasuryNftPolicyId,
  });

  const nextSteps = [
    {
      text: `View Project Tasks`,
      url: `/projects`,
    },
    { text: "Browse all Projects", url: "/projects" },
  ];

  return (
    <Dialog>
      <DialogTrigger>
        <Button disabled={!connected || !accessTokenAlias}>Join Project</Button>
      </DialogTrigger>
      <DialogContent className="flex items-center justify-center justify-items-center">
        {successTxHash ? (
          <SuccessTxModalContent
            txName="Join Project Tx"
            nextStepLinks={nextSteps}
            txHash={successTxHash}
          />
        ) : (
          <DialogHeader>
            <DialogTitle className="py-4">
              Ready to join this Project?
            </DialogTitle>
            <pre className="text-[6pt]">{treasuryNftPolicyId}</pre>
            <pre className="text-[6pt]">
              Contributor CS:{" "}
              {!!contributorPolicies &&
                contributorPolicies[0]?.contributorPolicy}
            </pre>
            <div className="space-y-2">
              {contributorPolicies && contributorPolicies[0] && (
                <MintProjectState
                  treasuryNftPolicyId={treasuryNftPolicyId ?? ""}
                  contributorPolicyId={contributorPolicies[0].contributorPolicy}
                  setSuccessTxHash={setSuccessTxHash}
                />
              )}
            </div>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
}
