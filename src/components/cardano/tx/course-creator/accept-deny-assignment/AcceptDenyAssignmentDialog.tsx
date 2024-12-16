import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";
import SuccessTxModalContent from "~/components/cardano/common/SuccessTxComponent";
import AcceptDenyAssignment from "./AcceptDenyAssignment";

export default function AcceptDenyAssignmentDialog({
  assignmentCommitmentId,
  courseNftPolicy,
  userAccessTokenUnit,
  studentAlias,
  decision,
}: {
  assignmentCommitmentId: string;
  courseNftPolicy: string;
  userAccessTokenUnit: string;
  studentAlias: string;
  decision: "accept" | "deny";
}) {
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const nextSteps = [
    { text: "Learn about Learner Status", url: "/course/andamio101" },
    { text: "Review Documentation", url: "/course/andamio101" },
    { text: "Return to Teacher Dashboard", url: "/dashboard/teacher" },
  ];

  return (
    <Dialog key={courseNftPolicy + studentAlias}>
      <DialogTrigger>
        {decision === "accept" && <Button>Accept Assignment Commitment</Button>}
        {decision === "deny" && <Button>Deny Assignment Commitment</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-7xl border-l-[10px] border-secondary">
        <div className="grid grid-cols-2 gap-8">
          <div className="p-2">
            {successTxHash ? (
              <SuccessTxModalContent
                txName={
                  decision === "accept" ? "Accept Assignment" : "Deny Assignment"
                }
                nextStepLinks={nextSteps}
                txHash={successTxHash}
              />
            ) : (
              <>
                {decision === "accept" && (
                  <>
                    <h1>Publish Credential Criteria</h1>
                    <h2>
                      What it means to publish credential criteria
                    </h2>
                    <p>
                      By accepting this assignment commitment, you will issue a
                      credential to {studentAlias} asserting that this assignment is
                      complete. Did {studentAlias} provide sufficient evidence that
                      the Assignment is complete?
                    </p>
                    <p>If yes, then you can put this credential on-chain!</p>
                  </>
                )}
                {decision === "deny" && (
                  <>
                    <h1>Deny Assignment Submission</h1>
                    <h2>
                      What it means to deny an Assignment
                    </h2>
                    <p>
                      {studentAlias} will still be committed to this Assignment and
                      will be able to resubmit evidence of completion. Be sure to
                      communicate with learners about their assignment status.
                    </p>
                  </>
                )}
              </>
            )}
          </div>
          <div className="p-2">
            <AcceptDenyAssignment
              assignmentCommitmentId={assignmentCommitmentId}
              courseNftPolicy={courseNftPolicy}
              userAccessTokenUnit={userAccessTokenUnit}
              studentAlias={studentAlias}
              decision={decision}
              setSuccessTxHash={setSuccessTxHash}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
