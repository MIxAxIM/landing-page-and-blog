import { CardanoWallet } from "@meshsdk/react";
import { useEffect, useState } from "react";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import { Assignment, AssignmentCommitment } from "~/types/db";
import AssignmentEvidenceEditor from "./AssignmentEvidenceEditor";

export default function AssignmentCommitmentPageComponent({
  courseNftPolicyId,
  moduleTokenName,
}: {
  courseNftPolicyId: string,
  moduleTokenName: string,
}) {
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
  const decodedAssignmentDatum = ""

  // Database query:
  // TODO: Write the db router queries


  // TODO: Write helpful useEffects

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div
          className="mt-2 max-w-fit transform rounded-lg bg-white p-4 shadow-md transition-transform"
        >
          <h3 className="font-bold">Task Details</h3>
          <div className="max-w-fit grid grid-cols-3">
            {currentAssignment && (
              <div>
                <p className="text-xs text-slate-500">Assignment Title: {currentAssignment.title}</p>
                <p className="text-xs text-slate-500">Assignment Title: {currentAssignment?.description}</p>
              </div>
            )}
            <div>
              <p>Task Status</p>
              {!!currentAssignment && (
                <div>TODO: Assignment Status Indicator goes here</div>
              )}
            </div>
            <div>
              {!accessTokenAlias && <CardanoWallet />}
              <div>
                <div>TODO: Assignment Decoded Datum goes here</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-1">
        <h3>Enter Submission Details</h3>
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
              assignmentId={currentAssignment?.id ?? ""}
              lock={lock}
              setLock={setLock}
              evidenceHash={evidenceHash}
              setEvidenceHash={setEvidenceHash}
            />
          </>
        )}
        {decodedAssignmentDatum ? (
          <>
            <div>Add Assignment Info Dialog</div>
          </>
        ) : (
          <>
            <div>Commit Assignment Dialog</div>
          </>
        )}
      </div>

    </div>

  )
}
