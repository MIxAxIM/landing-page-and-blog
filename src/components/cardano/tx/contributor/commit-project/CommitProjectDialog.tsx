
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

export default function CommitProjectDialog({
  treasuryNftPolicyId,
  project,
  info,
}: {
  treasuryNftPolicyId: string;
  project: string;
  info: string;
}) {
  const { connected } = useWallet();
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(undefined);

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button intent="dialog" size="dialog" className="mx-auto">
            Commit to Assignment
          </Button>
        </DialogTrigger>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle>Commit to Assignment</DialogTitle>
            <DialogDescription>
              By completing this transaction, you will make a public
              commitment to Project id on the Andamio
              Network.
            </DialogDescription>
          </DialogHeader>
          {!connected && "Connect a wallet to make a commitment."}
          {!!connected &&
            "Enter Assignment Info, then press Commit to sign a transaction."}

          <CommitProject
            treasuryNftPolicyId={treasuryNftPolicyId}
            project={project}
            info={info}
            setSuccessTxHash={setSuccessTxHash}
          />
          <DialogFooter>
            <p className="pt-5 text-xs font-bold">
              To learn about network Project Commitments, view{" "}
              <Link href="/course/andamio101">
                <span className="underline">
                  Andamio 101
                </span>
              </Link>
              .
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
