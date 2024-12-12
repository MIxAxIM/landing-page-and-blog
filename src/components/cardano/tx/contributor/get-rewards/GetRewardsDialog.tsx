
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";
import GetRewards from "./GetRewards";

export default function GetRewardsDialog({
  taskCommitmentId,
  treasuryNftPolicyId,
}: {
  taskCommitmentId: string;
  treasuryNftPolicyId: string;
}) {
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  return (
    <Dialog>
      <DialogTrigger className="m-0 p-0">
        <Button size="sm">Claim Rewards</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl">
        <div className="grid grid-cols-2 gap-8">
          <div className="p-2">
            <h3>Claim Rewards</h3>
            <p className="prose">
              Claim rewards for completing tasks.
            </p>
          </div>
          <div className="p-2">
            <GetRewards
              taskCommitmentId={taskCommitmentId}
              treasuryNftPolicyId={treasuryNftPolicyId}
              setSuccessTxHash={setSuccessTxHash}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
