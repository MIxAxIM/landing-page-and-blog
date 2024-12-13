import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";
import BurnLocalState from "./BurnLocalState";

export default function BurnLocalStateDialog({
  accessTokenAssetId,
  courseNftPolicyId,
}: {
  accessTokenAssetId: string;
  courseNftPolicyId: string;
}) {
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  return (
    <Dialog>
      <DialogTrigger className="m-0 p-0">
        <Button size="sm">Leave Course + Receive Credential</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl border-l-[10px] border-secondary">
        <div className="grid grid-cols-2 gap-8">
          <div className="p-2">
            <h3>Leave Course + Receive Credential</h3>
            <p className="prose">
              You can leave a course any time. When you do, you will earn an Andamio credential for the course modules you have completed. Then, you will be able to use this credential to join projects.
            </p>
          </div>
          <div className="p-2">
            <BurnLocalState
              accessTokenAssetId={accessTokenAssetId}
              courseNftPolicyId={courseNftPolicyId}
              setSuccessTxHash={setSuccessTxHash}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
