import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Button } from "~/components/ui/button";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { useAccessToken } from "~/hooks/cardano-indexer-api/useAccessToken";
import Loading from "~/components/common/loading";
import useGlobalStateDatum from "~/hooks/cardano-indexer-api/useGlobalStateDatum";
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
  const [isOpen, setIsOpen] = useState(false);
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
          <DialogContent className="flex items-center justify-center justify-items-center">
            {successTxHash ? (
              <SuccessTxModalContent
                txName="Course Enrollment"
                nextStepLinks={nextSteps}
                txHash={successTxHash}
              />
            ) : (
              <DialogHeader>
                <DialogTitle className="py-4">
                  Thinking of taking this course?
                </DialogTitle>
                <DialogDescription>
                  {!isOpen && (
                    <div className="py-4 text-xs text-black hover:font-semibold hover:text-primary sm:justify-start">
                      <Link href={`/course/${courseCode}`}>
                        I&apos;ll do it after taking a look inside first
                      </Link>
                    </div>
                  )}
                  <Collapsible
                    open={isOpen}
                    onOpenChange={setIsOpen}
                    className="w-[350px] space-y-2 py-4"
                  >
                    <div className="flex w-full items-center justify-center">
                      <CollapsibleTrigger asChild>
                        <Button>
                          {isOpen ? <>Back</> : <>Enroll On Andamio Network</>}
                        </Button>
                      </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent className="space-y-2">
                      <>
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
                      </>
                    </CollapsibleContent>
                  </Collapsible>
                </DialogDescription>
              </DialogHeader>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
