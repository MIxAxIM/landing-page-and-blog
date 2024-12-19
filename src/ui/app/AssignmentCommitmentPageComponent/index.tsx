import { CardanoWallet } from "@meshsdk/react";
import { useEffect, useState } from "react";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import { Assignment, AssignmentCommitment } from "~/types/db";
import AssignmentEvidenceEditor from "./AssignmentEvidenceEditor";
import { useAssignmentCommitment } from "~/hooks/db/course/useAssignmentCommitment";
import CommitToAssignmentDialog from "~/components/cardano/tx/student/commit-to-assignment/CommitToAssignmentDialog";
import UpdateAssignmentDialog from "~/components/cardano/tx/student/update-assignment/UpdateAssignmentDialog";
import useAssignmentDatums from "~/hooks/cardano-indexer-api/course/useAssignmentDatums";
import { useSession } from "next-auth/react";
import useAssignment from "~/hooks/db/course/useAssignment";
import { AssignmentCommitmentStatusIndicator } from "~/ui/course/components/ui/status/AssignmentStatusIndicators";
import { useAssignmentCommitmentStatusCheck } from "~/hooks/cardano-indexer-api/polling/useAssignmentCommitmentStatusCheck";
import LeaveAssignmentDialog from "~/components/cardano/tx/student/leave-assignment/LeaveAssignmentDialog";
import { Card } from "~/components/ui/card";

export default function AssignmentCommitmentPageComponent({
  courseCode,
  moduleCode,
  courseNftPolicyId
}: {
  courseCode: string,
  moduleCode: string,
  courseNftPolicyId: string
}) {
  useAssignmentCommitmentStatusCheck(courseCode, courseNftPolicyId)
  const { data: sessionData } = useSession();
  const [currentAssignment, setCurrentAssignment] = useState<Assignment | undefined>(undefined);
  const [currentAssignmentCommitment, setCurrentAssignmentCommitment] = useState<AssignmentCommitment | undefined>(undefined);
  const [lock, setLock] = useState(false);
  const [evidenceHash, setEvidenceHash] = useState<string | undefined>(
    undefined,
  );

  // Connected wallet query:
  const { accessTokenAlias } = useAccessToken()

  // Andamio Indexer query:
  // TODO: Get the right indexer queries
  const { assignmentDatum } = useAssignmentDatums(courseNftPolicyId, accessTokenAlias)

  // Database query:
  // TODO: Write the db router queries
  const { assignmentCommitmentsByCourseModule } = useAssignmentCommitment({ courseCode: courseCode, moduleCode: moduleCode, learnerId: sessionData?.user?.learnerId })
  const { assignment } = useAssignment(courseCode, moduleCode)

  useEffect(() => {
    if (assignmentCommitmentsByCourseModule && assignmentCommitmentsByCourseModule.length > 0) {
      setCurrentAssignmentCommitment(assignmentCommitmentsByCourseModule[0])
    }
  }, [assignmentCommitmentsByCourseModule])

  // TODO: Write helpful useEffects
  useEffect(() => {
    if (currentAssignmentCommitment && !!currentAssignmentCommitment.networkEvidenceHash) {
      setEvidenceHash(currentAssignmentCommitment.networkEvidenceHash)
    }
  }, [currentAssignmentCommitment])

  return (
    <Card>
      <div className="flex flex-row items-center justify-center">
        <div className="max-w-fit grid grid-cols-3">
          <div>
            {!accessTokenAlias && <CardanoWallet />}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-1">
        <div className="flex flex-row w-full items-center justify-between">
          <h3>Share Evidence and Commit to this Assignment</h3>
          <AssignmentCommitmentStatusIndicator
            privateStatus={currentAssignmentCommitment?.privateStatus ?? "IN_PROGRESS"}
            networkStatus={currentAssignmentCommitment?.networkStatus}
            showLabel={true}
          />
        </div>
        {currentAssignmentCommitment ? (
          <>
            <AssignmentEvidenceEditor
              assignmentCommitment={currentAssignmentCommitment}
              lock={lock}
              setLock={setLock}
              evidenceHash={evidenceHash}
              setEvidenceHash={setEvidenceHash}
            />
          </>
        ) : (
          <>
            <AssignmentEvidenceEditor
              assignmentId={assignment?.id ?? ""}
              lock={lock}
              setLock={setLock}
              evidenceHash={evidenceHash}
              setEvidenceHash={setEvidenceHash}
            />
          </>
        )}
        {(currentAssignmentCommitment?.networkStatus != "PENDING_APPROVAL") && !!assignmentDatum && !!currentAssignmentCommitment?.id ? (
          <div className="flex flex-row justify-between items-center w-1/2 mx-auto">
            <UpdateAssignmentDialog
              assignmentCommitmentId={currentAssignmentCommitment?.id}
              courseCode={courseCode}
              assignmentCode={moduleCode}
              networkEvidenceHash={evidenceHash ?? ""}
              courseNftPolicyId={courseNftPolicyId}
            />
            <LeaveAssignmentDialog
              assignmentCommitmentId={currentAssignmentCommitment?.id}
              courseNftPolicyId={courseNftPolicyId}
            />
          </div>
        ) : (
          <>
            <CommitToAssignmentDialog
              courseCode={courseCode}
              moduleCode={moduleCode}
              courseNftPolicyId={courseNftPolicyId}
              networkEvidenceHash={evidenceHash ?? ""}
            />

          </>
        )}
      </div>

    </Card>

  )
}
