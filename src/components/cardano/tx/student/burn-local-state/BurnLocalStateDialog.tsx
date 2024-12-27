import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";
import BurnLocalState from "./BurnLocalState";
import { useSession } from "next-auth/react";
import SuccessTxModalContent from "~/components/cardano/common/SuccessTxComponent";

export default function BurnLocalStateDialog({
  accessTokenAssetId,
  courseCode,
  courseNftPolicyId,
}: {
  accessTokenAssetId: string;
  courseCode: string;
  courseNftPolicyId: string;
}) {
  const { data: sessionData } = useSession();
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  if (!sessionData?.user.learnerId) return

  return (
    <Dialog>
      <DialogTrigger className="m-0 p-0">
        <Button size="sm">Claim Credentials</Button>
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
            {successTxHash ? (
              <SuccessTxModalContent
                txName="You are now unenrolled from the course"
                nextStepLinks={[]}
                txHash={successTxHash}
              />
            ) : (
              <BurnLocalState
                learnerId={sessionData?.user.learnerId}
                courseCode={courseCode}
                accessTokenAssetId={accessTokenAssetId}
                courseNftPolicyId={courseNftPolicyId}
                setSuccessTxHash={setSuccessTxHash}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
