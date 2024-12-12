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
import useAssignmentNetworkStatus from "~/hooks/cardano-indexer-api/course/useAssignmentNetworkStatus";
import CommitToAssignment from "~/components/cardano/tx/student/commit-to-assignment/CommitToAssignment";

export default function CommitToAssignmentDialog({
  courseCode,
  assignmentCode,
}: {
  courseCode: string;
  assignmentCode: string;
}) {
  const { connected } = useWallet();

  // For now, assume that assignmentCode must match moduleCode
  const { isAssignmentOnchain, isLearnerCommitted } =
    useAssignmentNetworkStatus({
      courseCode: courseCode,
      moduleCode: assignmentCode,
    });

  return (
    <>
      {!isAssignmentOnchain ? (
        <p>Assignment {assignmentCode} is not published on chain</p>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button intent="dialog" size="dialog" className="mx-auto">
              Commit to Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl">
            <div className="grid grid-cols-2 gap-8">
              <div className="p-2">
                <DialogHeader>
                  <DialogTitle>Commit to Assignment</DialogTitle>
                  <DialogDescription>
                    By completing this transaction, you will make a public
                    commitment to Assignment {assignmentCode} on the Andamio
                    Network.
                  </DialogDescription>
                </DialogHeader>
                {!connected && "Connect a wallet to make a commitment."}
                {!!connected &&
                  "Enter Assignment Info, then press Commit to sign a transaction."}

                <DialogFooter>
                  <p className="pt-5 text-xs font-bold">
                    To learn about network Assignment Commitments, view{" "}
                    <Link href="/course/andamio101/102/lesson/4">
                      <span className="underline">
                        Lesson 102.4 in the Andamio 101 Course
                      </span>
                    </Link>
                    .
                  </p>
                </DialogFooter>
              </div>
              <div className="p-2">
                <CommitToAssignment
                  courseCode={courseCode}
                  assignmentCode={assignmentCode}
                  isCommitted={isLearnerCommitted ?? false}
                />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
