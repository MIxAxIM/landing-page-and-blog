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
import { useAccessToken } from "~/hooks/onchain/useAccessToken";
import Loading from "~/components/loading";
import SuccessTxModalContent from "../SuccessTxComponent";
import useGlobalStateDatum from "~/hooks/onchain/useGlobalStateDatum";
import MintProjectState from "../contributor/mintProjectState";

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
                <pre>{treasuryNftPolicyId}</pre>
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
                            !!treasuryNftPolicyId ? (
                            <MintProjectState treasuryNftPolicyId={treasuryNftPolicyId ?? ""} setSuccessTxHash={setSuccessTxHash} />
                          ) : (
                            <Loading />
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
