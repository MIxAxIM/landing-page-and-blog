import { Card, CardContent, CardHeader } from "~/components/ui/card";

import AssignmentBadges from "~/components/ui/assignment-badges";
import DialogAssignmentCommitmentOnNetwork from "../dialogs/DialogAssignmentCommitmentOnNetwork";
import useAssignmentNetworkStatus from "~/hooks/onchain/useAssignmentNetworkStatus";
import LoadingCircle from "~/ui/studio/components/ContentEditor/ui/icons/loading-circle";

export default function NetworkCommitmentCard({
  courseCode,
  moduleCode,
}: {
  courseCode: string;
  moduleCode: string;
}) {
  const {
    isAssignmentOnchain,
    isLearnerCommitted,
    isLoadingLearnerCommitted,
    isLoadingAssignment,
  } = useAssignmentNetworkStatus({
    courseCode: courseCode,
    moduleCode: moduleCode,
  });
  // here we assume that assignment code matches module code

  if (!isAssignmentOnchain) {
    return null;
  }

  return (
    <Card className="border border-primary shadow-md">
      <CardHeader className="flex w-full flex-row items-center justify-between">
        <h2>
          Commit to Assignment on Andamio Network
        </h2>

        {isLearnerCommitted && <AssignmentBadges status="COMMITMENT" />}
        {isAssignmentOnchain && !isLearnerCommitted && (
          <AssignmentBadges status="NETWORK_READY" />
        )}
      </CardHeader>
      <CardContent>
        <div className="my-5 flex flex-col items-center justify-center gap-3">
          {isLoadingAssignment || isLoadingLearnerCommitted ? (
            <LoadingCircle />
          ) : (
            <>
              {isLearnerCommitted ? (
                "You are currently committed to this assignment"
              ) : (
                <DialogAssignmentCommitmentOnNetwork
                  courseCode={courseCode}
                  assignmentCode={moduleCode}
                />
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
