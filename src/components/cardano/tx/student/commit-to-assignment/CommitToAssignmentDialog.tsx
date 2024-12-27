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
import { useAssignmentCommitment } from "~/hooks/db/course/useAssignmentCommitment";
import { useSession } from "next-auth/react";

export default function CommitToAssignmentDialog({
  courseCode,
  moduleCode,
  courseNftPolicyId,
  networkEvidenceHash,
}: {
  courseCode: string;
  moduleCode: string;
  courseNftPolicyId: string;
  networkEvidenceHash: string;
}) {
  const { connected } = useWallet();
  const { data: sessionData } = useSession()

  // For now, assume that assignmentCode must match moduleCode
  const { isAssignmentOnchain, isLearnerCommitted } =
    useAssignmentNetworkStatus({
      courseCode: courseCode,
      moduleCode: moduleCode,
      courseNftPolicyId: courseNftPolicyId
    });

  const { assignmentCommitmentsByCourse } = useAssignmentCommitment({
    courseCode: courseCode,
    moduleCode: moduleCode,
    learnerId: sessionData?.user.learnerId ?? ""
  });

  return (
    <>
      {!isAssignmentOnchain ? (
        <p>Assignment {moduleCode} is not published on chain</p>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button intent="dialog" size="dialog" className="mx-auto">
              Commit to Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-7xl border-l-[10px] border-secondary">
            <div className="grid grid-cols-2 gap-8">
              <div className="p-2">
                <DialogHeader>
                  <DialogTitle>Commit to Assignment</DialogTitle>
                  <DialogDescription>
                    By completing this transaction, you will make a public
                    commitment to Assignment {moduleCode} on the Andamio
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
                {!!assignmentCommitmentsByCourse && !!assignmentCommitmentsByCourse[0] && (
                  <CommitToAssignment
                    assignmentCode={moduleCode}
                    assignmentCommitmentId={assignmentCommitmentsByCourse[0]?.id ?? ""}
                    isCommitted={isLearnerCommitted ?? false}
                    networkEvidenceHash={networkEvidenceHash}
                    courseNftPolicyId={courseNftPolicyId}
                  />
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
