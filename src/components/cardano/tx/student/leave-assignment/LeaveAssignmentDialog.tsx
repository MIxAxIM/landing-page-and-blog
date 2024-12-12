import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";
import LeaveAssignment from "./LeaveAssignment";

export default function LeaveAssignmentDialog({
  courseNftPolicyId,
}: {
  courseNftPolicyId: string;
}) {
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  if (successTxHash) {
    alert("Success");
  }
  return (
    <Dialog>
      <DialogTrigger className="m-0 p-0">
        <Button size="sm">Leave Assignment</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl border-l-[10px] border-secondary">
        <div className="grid grid-cols-2 gap-8">
          <div className="p-2">
            <h3>Unlock Project</h3>
            <p className="prose">
              If you will not complete this assignment, you can unlock your commitment.
            </p>
          </div>
          <div className="p-2">
            <LeaveAssignment
              courseNftPolicyId={courseNftPolicyId}
              setSuccessTxHash={setSuccessTxHash}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
