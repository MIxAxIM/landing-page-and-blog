import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";
import BurnLocalState from "../course/learner/burnLocalState/BurnLocalState";

// TODO: 
// 1. DONE - Change filename and component name
// 2. Use Burn Tx Component
// 3. That uses Burn router endpoint
// 4. Then make sure this button works
// 5. And confirm that it moves to Global State
// 6. Then, see if I can commit to a task in Tx 9!
export default function BurnCourseEnrollmentDialog({
  accessTokenAssetId,
  courseNftPolicyId,
}: {
  accessTokenAssetId: string;
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
        <Button size="sm">BURN LOCAL STATE - FIX THIS</Button>
      </DialogTrigger>
      <DialogContent>
        <p>{accessTokenAssetId}</p>
        <p>{courseNftPolicyId}</p>
        <BurnLocalState
          accessTokenAssetId={accessTokenAssetId}
          courseNftPolicyId={courseNftPolicyId}
          setSuccessTxHash={setSuccessTxHash}
        />
      </DialogContent>
    </Dialog>
  );
}
