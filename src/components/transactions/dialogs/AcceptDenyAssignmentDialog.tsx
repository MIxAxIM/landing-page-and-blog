import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import AcceptDenyAssignment from "../course/creator/acceptDenyAssignment/AcceptDenyAssignment";
import { useState } from "react";
import SuccessTxModalContent from "../SuccessTxComponent";

export default function AcceptDenyAssignmentDialog({
  courseNftPolicy,
  userAccessTokenUnit,
  studentAlias,
  decision,
}: {
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
      <DialogContent>
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
            {/* What it means to mint a Module */}
            <AcceptDenyAssignment
              courseNftPolicy={courseNftPolicy}
              userAccessTokenUnit={userAccessTokenUnit}
              studentAlias={studentAlias}
              decision={decision}
              setSuccessTxHash={setSuccessTxHash}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
