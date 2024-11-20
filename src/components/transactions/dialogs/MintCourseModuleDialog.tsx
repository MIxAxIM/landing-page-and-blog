import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { type CourseModuleOverview } from "~/types/db";
import MintCourseModule from "../course/creator/mintCourseModule/MintCourseModule";
import { useAccessToken } from "~/hooks/onchain/useAccessToken";
import { useState } from "react";
import { motion } from "framer-motion";
import SuccessTxModalContent from "../SuccessTxComponent";

export default function MintCourseModuleDialog({
  courseModuleOverview,
  courseNftPolicyId,
}: {
  courseModuleOverview: CourseModuleOverview;
  courseNftPolicyId: string;
}) {
  const { accessTokenAsset } = useAccessToken();

  const [confirmedSlts, setConfirmedSlts] = useState<boolean[]>(
    courseModuleOverview.slts.map(() => false),
  );

  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const toggleSlt = (i: number) => {
    const updatedSlts = [...confirmedSlts];
    updatedSlts[i] = !updatedSlts[i];
    setConfirmedSlts(updatedSlts);
  };

  const nextSteps = [
    { text: "Share on Social", url: "https://twitter.com" },
    { text: "Learn about Learner Status", url: "/course/andamio101" },
    { text: "Review Documentation", url: "/course/andamio101" },
  ];

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Publish Credential Criteria</Button>
      </DialogTrigger>
      <DialogContent>
        {successTxHash ? (
          <SuccessTxModalContent
            txName="Publish Credential"
            nextStepLinks={nextSteps}
            txHash={successTxHash}
          />
        ) : (
          <>
            <h1>Publish Credential Criteria</h1>
            {/* What it means to mint a Module */}
            <h2>
              What it means to publish credential criteria
            </h2>
            <p>
              By minting this module you are making a promise and setting the
              rules for an on-chain credential that you will issue. Are you sure
              that Module {courseModuleOverview.moduleCode} covers these SLTs?
              Are you sure that this Assignment provides sufficient evidence of
              learner progress?
            </p>
            <p>If yes, then you can put this module on-chain!</p>
            {/* About this Module */}
            <h2>Student Learning Targets</h2>
            <p className="mb-2">
              Click on each SLT to confirm Credential Criteria:
            </p>
            {courseModuleOverview.slts.map((slt, j) => (
              <motion.div
                key={j}
                onClick={() => toggleSlt(j)}
                animate={{
                  backgroundColor: confirmedSlts[j] ? "#77Cf8f" : "#f2be5d",
                }}
                transition={{ duration: 0.5 }}
                className="cursor-pointer rounded-md p-2"
              >
                <p>
                  {courseModuleOverview.moduleCode}.{slt.moduleIndex}:{" "}
                  {slt.sltText}
                </p>
              </motion.div>
            ))}
            <h2>Assignment:</h2>
            {courseModuleOverview.assignments?.length > 0 && (
              <p>{courseModuleOverview.assignments[0]?.title}</p>
            )}
            {/* Confirm Tx Button */}
            {accessTokenAsset && confirmedSlts.every((s) => s === true) && (
              <MintCourseModule
                accessTokenAssetId={accessTokenAsset.unit}
                courseNftPolicyId={courseNftPolicyId}
                courseModuleOverview={courseModuleOverview}
                setSuccessTxHash={setSuccessTxHash}
              />
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
