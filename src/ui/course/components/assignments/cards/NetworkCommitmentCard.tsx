import { Card, CardContent, CardHeader } from "~/components/ui/card";

import AssignmentBadges from "~/components/ui/assignment-badges";
import useAssignmentNetworkStatus from "~/hooks/cardano-indexer-api/useAssignmentNetworkStatus";
import LoadingCircle from "~/components/editor/ContentEditor/ui/icons/loading-circle";
import useNetworkLearner from "~/hooks/cardano-indexer-api/useNetworkLearner";
import { useAccessToken } from "~/hooks/cardano-indexer-api/useAccessToken";
import MintLocalStateDialog from "~/components/cardano/tx/student/mint-local-state/MintLocalStateDialog";
import MintAccessTokenDialog from "~/components/cardano/tx/access-token/MintAccessTokenDialog";
import CommitToAssignmentDialog from "~/components/cardano/tx/student/commit-to-assignment/CommitToAssignmentDialog";

export default function NetworkCommitmentCard({
  courseCode,
  moduleCode,
  courseNftPolicyId,
}: {
  courseCode: string;
  moduleCode: string;
  courseNftPolicyId: string;
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
  const { isEnrolled } = useNetworkLearner({ courseNftPolicyId: courseNftPolicyId })
  const { accessTokenAlias } = useAccessToken()


  if (!isAssignmentOnchain) {
    return null;
  }

  return (
    <Card className="border border-primary shadow-md">
      <CardHeader className="flex w-full flex-row items-center justify-between">
        {isEnrolled ? (
          <>
            <h2>
              Commit to Assignment on Andamio Network
            </h2>
            {isLearnerCommitted && <AssignmentBadges status="COMMITMENT" />}
            {isAssignmentOnchain && !isLearnerCommitted && (
              <AssignmentBadges status="NETWORK_READY" />
            )}
          </>
        ) : (
          <h2>You are not enrolled in this course</h2>
        )}

      </CardHeader>
      <CardContent>
        <div className="my-5 flex flex-col items-center justify-center gap-3">
          {isEnrolled ? (
            <>
              {isLoadingAssignment || isLoadingLearnerCommitted ? (
                <LoadingCircle />
              ) : (
                <>
                  {isLearnerCommitted ? (
                    "You are currently committed to this assignment"
                  ) : (
                    <CommitToAssignmentDialog
                      courseCode={courseCode}
                      assignmentCode={moduleCode}
                    />
                  )}
                </>
              )}

            </>
          ) : (
            <>
              <h2>Learn how to enroll</h2>
              {!!accessTokenAlias ? (
                <>
                  <p>Your access token: {accessTokenAlias}</p>
                  <p>Enroll now</p>
                  <MintLocalStateDialog courseNftPolicyId={courseNftPolicyId} courseTitle={"Course"} courseCode={courseCode} />
                </>

              ) : (
                <MintAccessTokenDialog />

              )}

            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
