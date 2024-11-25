import Link from "next/link";
import { useEffect, useState } from "react";
import { type CoursePublic } from "~/types/db";
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
import { useAccessToken } from "~/hooks/onchain/useAccessToken";
import MintLocalState from "~/components/transactions/course/learner/mintLocalState/MintLocalState";
import Loading from "~/components/loading";
import SuccessTxModalContent from "../SuccessTxComponent";
import useGlobalStateDatum from "~/hooks/onchain/useGlobalStateDatum";

// TODO: Check if this access token is enrolled (via Global State query)
// Delete checkIfEnrolled

export default function MintCourseEnrollmentDialog({
  course,
}: {
  course: CoursePublic;
}) {
  const { connected, wallet } = useWallet();
  const { accessTokenAsset, accessTokenAlias } = useAccessToken();
  const [isOpen, setIsOpen] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const { globalStateDatum } = useGlobalStateDatum(accessTokenAlias ?? "")

  const nextSteps = [
    {
      text: `View ${course.title} Course`,
      url: `/course/${course.courseCode}`,
    },
    { text: "Browse More Courses", url: "/courses" },
    { text: "Go to Dashboard", url: "/dashboard/learner" },
  ];


  useEffect(() => {
    if (!!globalStateDatum && !!course.onchainInstance[0]) {
      const _check = globalStateDatum.TokenInfos.some(ti => ti.LsCs === course.onchainInstance[0]?.CourseCreatorNFTPolicyID)
      setIsEnrolled(!!_check)
    }

  }, [globalStateDatum, course.onchainInstance]);

  return (
    <>
      {isEnrolled ? (
        <Link href={`/course/${course.courseCode}`}>
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
                      <Link href={`/course/${course.courseCode}`}>
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
                                  course.onchainInstance[0] ? (
                                  <MintLocalState
                                    userAccessTokenUnit={accessTokenAsset.unit}
                                    courseNftPolicyId={
                                      course.onchainInstance[0]
                                        .CourseCreatorNFTPolicyID
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
