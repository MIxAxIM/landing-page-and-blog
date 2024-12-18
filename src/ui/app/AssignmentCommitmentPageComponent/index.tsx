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
    <div>
      <div className="flex flex-col items-center justify-center">
        <div
          className="mt-2 max-w-fit transform rounded-lg bg-white p-4 shadow-md transition-transform"
        >
          <h3 className="font-bold">Task Details</h3>
          <AssignmentCommitmentStatusIndicator
            privateStatus={currentAssignmentCommitment?.privateStatus ?? "IN_PROGRESS"}
            networkStatus={currentAssignmentCommitment?.networkStatus}
            showLabel={true}
          />
          <div className="max-w-fit grid grid-cols-3">
            {currentAssignment && (
              <div>
                <p className="text-xs text-slate-500">Assignment Title: {currentAssignment.title}</p>
                <p className="text-xs text-slate-500">Assignment Title: {currentAssignment?.description}</p>
              </div>
            )}
            <div>
              <p>Task Status</p>
              {!!currentAssignmentCommitment && (
                <div>TODO: Assignment Status Indicator goes here</div>
              )}
            </div>
            <div>
              {!accessTokenAlias && <CardanoWallet />}
              <div>
                {!!assignmentDatum ? (
                  <pre>{JSON.stringify(assignmentDatum, null, 2)}</pre>
                ) : (
                  <p>No Assignment Info</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-1">
        <h3>Enter Submission Details</h3>
        {currentAssignmentCommitment ? (
          <>
            <p>HAS CURRENT ASSIGNMENT</p>
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
            <p>NO CURRENT ASSIGNMENT</p>
            <AssignmentEvidenceEditor
              assignmentId={assignment?.id ?? ""}
              lock={lock}
              setLock={setLock}
              evidenceHash={evidenceHash}
              setEvidenceHash={setEvidenceHash}
            />
          </>
        )}
        {!!assignmentDatum && !!currentAssignmentCommitment?.id ? (
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

    </div>

  )
}
