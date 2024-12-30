import { type AssignmentNetworkStatus } from "@prisma/client";
import { blake2b } from "blakejs";
import { Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { type Dispatch, type SetStateAction, useEffect, useState, useMemo } from "react";
import ContentEditorSm from "~/components/editor/ContentEditor/editor-sm";
import { Button } from "~/components/ui/button";
import { useAssignmentCommitment } from "~/hooks/db/course/useAssignmentCommitment";
import type { AssignmentCommitment } from "~/types/db";
import useTaskCommitmentEditor from "~/ui/project/useTaskCommitmentEditor";

export default function AssignmentEvidenceEditor({
  assignmentCommitment,
  assignmentId,
  lock,
  setLock,
  evidenceHash,
  setEvidenceHash
}: {
  assignmentCommitment?: AssignmentCommitment,
  assignmentId?: string,
  lock: boolean,
  setLock: Dispatch<SetStateAction<boolean>>
  evidenceHash: string | undefined,
  setEvidenceHash: Dispatch<SetStateAction<string | undefined>>
}) {
  const { editor } = useTaskCommitmentEditor({
    assignmentCommitment: assignmentCommitment,
    editable: !lock
  });
  const { createAssignmentCommitment, updateNetworkEvidence } = useAssignmentCommitment({});
  const { data: session } = useSession();
  const [isEditable, setIsEditable] = useState(false);

  // Move editableStatuses to useMemo to prevent recreation on every render
  const editableStatuses = useMemo<AssignmentNetworkStatus[]>(() => [
    "AWAITING_EVIDENCE",
    "PENDING_TX_COMMITMENT_MADE",
    "PENDING_TX_ADD_INFO",
    "ASSIGNMENT_DENIED",
    "ASSIGNMENT_LEFT"
  ], []);

  // Effect for handling evidence updates
  useEffect(() => {
    if (!lock && !(assignmentCommitment?.networkStatus === "AWAITING_EVIDENCE")) {
      return;
    }

    const data = editor?.getJSON();
    if (!data) {
      return;
    }

    const hash = blake2b(Buffer.from(JSON.stringify(data)), undefined, 32);
    const hexHash = Buffer.from(hash).toString("hex");
    setEvidenceHash(hexHash);

    if (assignmentCommitment) {
      updateNetworkEvidence({
        id: assignmentCommitment.id,
        networkEvidence: data,
        networkEvidenceHash: hexHash,
      });
    } else if (assignmentId && session?.user.learnerId) {
      createAssignmentCommitment({
        assignmentId,
        networkEvidence: data,
        networkStatus: "AWAITING_EVIDENCE",
        learnerId: session.user.learnerId,
      });
    }
  }, [
    lock,
    editor,
    assignmentCommitment,
    assignmentId,
    session?.user.learnerId,
    setEvidenceHash,
    updateNetworkEvidence,
    createAssignmentCommitment
  ]);

  // Effect for handling editability
  useEffect(() => {
    const shouldBeEditable = !assignmentCommitment
      || (assignmentCommitment.networkStatus
        && editableStatuses.includes(assignmentCommitment.networkStatus));

    setIsEditable(shouldBeEditable);
  }, [assignmentCommitment, editableStatuses]);

  const handleLockToggle = () => {
    setLock(!lock);
  };

  return (
    <>
      {editor && <ContentEditorSm editor={editor} editable={!lock && isEditable} />}

      {lock && evidenceHash && (
        <div className="flex items-center justify-center">
          <h5>
            Data Hash: <b>{evidenceHash}</b>
          </h5>
        </div>
      )}

      <div className="flex p-4 items-center justify-center gap-3">
        {isEditable && (
          <Button
            className={`rounded-md text-white ${lock ? "bg-slate-500" : "bg-blue-500"}`}
            onClick={handleLockToggle}
          >
            {lock ? (
              <>
                <Lock className="mr-2" />
                Unlock
              </>
            ) : (
              "Lock"
            )}
          </Button>
        )}
      </div>
    </>
  );
}
