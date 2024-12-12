
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";
import UnlockProject from "./UnlockProject";

export default function UnlockProjectDialog({
  treasuryNftPolicyId,
}: {
  treasuryNftPolicyId: string;
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
        <Button size="sm">Unlock Project</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl">
        <div className="grid grid-cols-2 gap-8">
          <div className="p-2">
            <h3>Unlock Project</h3>
            <p className="prose">
              If you will not complete this task, you can unlock your commitment.
            </p>
          </div>
          <div className="p-2">
            <UnlockProject
              treasuryNftPolicyId={treasuryNftPolicyId}
              setSuccessTxHash={setSuccessTxHash}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
