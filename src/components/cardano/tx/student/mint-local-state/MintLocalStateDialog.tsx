import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import Loading from "~/components/common/loading";
import useGlobalStateDatum from "~/hooks/cardano-indexer-api/network/useGlobalStateDatum";
import SuccessTxModalContent from "~/components/cardano/common/SuccessTxComponent";
import MintLocalState from "./MintLocalState";

// TODO: Check if this access token is enrolled (via Global State query)
// Delete checkIfEnrolled

export default function MintLocalStateDialog({
  courseTitle,
  courseCode,
  courseNftPolicyId,
}: {
  courseTitle: string;
  courseCode: string;
  courseNftPolicyId: string;
}) {
  const { connected } = useWallet();
  const { accessTokenAsset, accessTokenAlias } = useAccessToken();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const { globalStateDatum } = useGlobalStateDatum(accessTokenAlias ?? "")

  const nextSteps = [
    {
      text: `View ${courseTitle} Course`,
      url: `/course/${courseCode}`,
    },
    { text: "Browse More Courses", url: "/courses" },
    { text: "Go to Dashboard", url: "/dashboard/learner" },
  ];


  useEffect(() => {
    if (!!globalStateDatum && !! !!courseNftPolicyId) {
      const _check = globalStateDatum.TokenInfos.some(ti => ti.LsCs === courseNftPolicyId)
      setIsEnrolled(!!_check)
    }

  }, [globalStateDatum, courseNftPolicyId]);

  return (
    <>
      {isEnrolled ? (
        <Link href={`/course/${courseCode}`}>
          <Button className="bg-success text-success-foreground hover:bg-green-400">
            Currently Enrolled
          </Button>
        </Link>
      ) : (
        <Dialog>
          <DialogTrigger>
            <Button>Enroll</Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl border-l-[10px] border-secondary">
            <div className="grid grid-cols-2 gap-8">
              <div className="p-2">
                {successTxHash ? (
                  <SuccessTxModalContent
                    txName="Course Enrollment"
                    nextStepLinks={nextSteps}
                    txHash={successTxHash}
                  />
                ) : (
                  <DialogHeader>
                    Enroll
                  </DialogHeader>
                )}
              </div>
              <div className="p-2">
                {!connected ? (
                  <CardanoWallet />
                ) : (
                  <>
                    {isEnrolled ? (
                      <div>Currently Enrolled</div>
                    ) : (
                      <>
                        {accessTokenAsset &&
                          !!courseNftPolicyId ? (
                          <MintLocalState
                            userAccessTokenUnit={accessTokenAsset.unit}
                            courseNftPolicyId={
                              courseNftPolicyId
                            }
                            setSuccessTxHash={setSuccessTxHash}
                          />
                        ) : (
                          <Loading />
                        )}
                      </>
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
