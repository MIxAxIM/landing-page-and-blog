import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useWallet } from "@meshsdk/react";
import Link from "next/link";
import CommitProject from "./CommitProject";
import { useState } from "react";
import { ProjectData } from "@andamiojs/datum-utils";
import { useTask } from "~/hooks/db/contribution/useTask";

export default function CommitProjectDialog({
  treasuryNftPolicyId,
  taskId,
  info,
  disabled,
}: {
  treasuryNftPolicyId: string;
  taskId: string;
  info?: string;
  disabled: boolean;
}) {
  const { connected } = useWallet();
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );
  const { task } = useTask({ id: taskId });

  // TODO:
  // What goes on-chain does not match task.tashHash - ask Adrian why?
  const apiProject = {
    pdProjectContent_: task?.taskHash ?? "",
    pdExpirationTime_: parseInt(task?.expirationTime ?? "0"),
    pdLovelaceAmount_: parseInt(task?.lovelace ?? "0"),
    pdTokens_: [],
  };

  console.log("apiProject", apiProject);
  console.log("treasuryNftPolicyId", treasuryNftPolicyId);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            disabled={disabled}
            intent="dialog"
            size="dialog"
            className="mx-auto"
          >
            Commit to Task
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-7xl border-l-[10px] border-secondary">
          <div className="grid grid-cols-2 gap-8">
            <div className="p-2">
              <DialogHeader>
                <DialogTitle>Commit to Task</DialogTitle>
                <DialogDescription>
                  By completing this transaction, you will make a public
                  commitment to this task on the Andamio Network.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <p className="pt-5 text-xs font-bold">
                  To learn about network Project Commitments, view{" "}
                  <Link href="/course/andamio101">
                    <span className="underline">Andamio 101</span>
                  </Link>
                  .
                </p>
              </DialogFooter>
            </div>
            <div className="p-2">
              {!connected && "Connect a wallet to make a commitment."}
              {!!connected &&
                "Enter Assignment Info, then press Commit to sign a transaction."}

              <CommitProject
                taskId={taskId}
                treasuryNftPolicyId={treasuryNftPolicyId}
                project={JSON.stringify(apiProject)}
                info={"Testing!"}
                successTxHash={successTxHash}
                setSuccessTxHash={setSuccessTxHash}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
