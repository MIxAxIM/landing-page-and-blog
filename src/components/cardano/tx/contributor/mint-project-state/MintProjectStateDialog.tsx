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
import useProjects from "~/hooks/cardano-indexer-api/project/useProjects";
import SuccessTxModalContent from "~/components/cardano/common/SuccessTxComponent";
import MintProjectState from "./MintProjectState";

// TODO: Check if this access token is enrolled (via Global State query)
// Delete checkIfEnrolled

export default function MintProjectStateDialog({
  treasuryNftPolicyId
}: {
  treasuryNftPolicyId?: string;
}) {
  const { connected } = useWallet();
  const { accessTokenAsset, accessTokenAlias } = useAccessToken();
  const [isOpen, setIsOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const { globalStateDatum } = useGlobalStateDatum(accessTokenAlias ?? "")
  const { contributorPolicies } = useProjects({ treasuryNftPolicyId: treasuryNftPolicyId })

  const nextSteps = [
    {
      text: `View Project Tasks`,
      url: `/projects`,
    },
    { text: "Browse all Projects", url: "/projects" },
  ];

  useEffect(() => {
    if (!!globalStateDatum && !! !!treasuryNftPolicyId) {
      const _check = globalStateDatum.TokenInfos.some(ti => ti.LsCs === treasuryNftPolicyId)
      setIsEnrolled(!!_check)
    }

  }, [globalStateDatum, treasuryNftPolicyId]);

  return (
    <>
      {isEnrolled ? (
        <Link href={`/projects`}>
          <Button className="bg-success text-success-foreground hover:bg-green-400">
            You are a member of this project - todo
          </Button>
        </Link>
      ) : (
        <Dialog>
          <DialogTrigger>
            <Button>Join Project</Button>
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
                <pre className="text-[6pt]">Contributor CS: {!!contributorPolicies && contributorPolicies[0]?.contributorPolicy}</pre>
                <div className="space-y-2">
                  {!connected ? (
                    <CardanoWallet />
                  ) : (
                    <>
                      {isEnrolled ? (
                        <div>You are currently contributing!</div>
                      ) : (
                        <>
                          {accessTokenAsset &&
                            !!treasuryNftPolicyId && !!contributorPolicies && !!contributorPolicies[0]?.contributorPolicy && (
                              <MintProjectState
                                treasuryNftPolicyId={treasuryNftPolicyId ?? ""}
                                contributorPolicyId={contributorPolicies[0]?.contributorPolicy}
                                setSuccessTxHash={setSuccessTxHash}
                              />
                            )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </DialogHeader>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
