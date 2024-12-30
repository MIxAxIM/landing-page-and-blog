import { type TaskCommitmentStatus } from "@prisma/client";
import { blake2b } from "blakejs";
import { Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { type Dispatch, type SetStateAction, useEffect, useState, useMemo } from "react";
import ContentEditorSm from "~/components/editor/ContentEditor/editor-sm";
import { Button } from "~/components/ui/button";
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment";
import { type TaskCommitment } from "~/types/db";
import useTaskCommitmentEditor from "../useTaskCommitmentEditor";

export default function TaskEvidenceEditor({
  taskCommitment,
  taskId,
  lock,
  setLock,
  evidenceHash,
  setEvidenceHash
}: {
  taskCommitment?: TaskCommitment,
  taskId?: string,
  lock: boolean,
  setLock: Dispatch<SetStateAction<boolean>>
  evidenceHash: string | undefined,
  setEvidenceHash: Dispatch<SetStateAction<string | undefined>>
}) {
  const { editor } = useTaskCommitmentEditor({
    taskCommitment: taskCommitment,
    editable: !lock
  });
  const { createTaskCommitment, updateTaskCommitmentEvidence } = useTaskCommitment({});
  const { data: session } = useSession();
  const [isEditable, setIsEditable] = useState(false);

  // Move editableStatuses to useMemo to prevent recreation on every render
  const editableStatuses = useMemo<TaskCommitmentStatus[]>(() => [
    "AWAITING_EVIDENCE",
    "COMMITMENT_DENIED",
    "UNLOCKED_BY_CONTRIBUTOR"
  ], []);

  // Effect for handling evidence updates
  useEffect(() => {
    if (!lock) {
      return;
    }

    const data = editor?.getJSON();
    if (!data) {
      return;
    }

    const hash = blake2b(Buffer.from(JSON.stringify(data)), undefined, 32);
    const hexHash = Buffer.from(hash).toString("hex");
    setEvidenceHash(hexHash);

    if (taskCommitment) {
      updateTaskCommitmentEvidence({
        id: taskCommitment.id,
        evidence: data,
      });
    } else if (taskId && session?.user.contributorId) {
      createTaskCommitment({
        taskId,
        evidence: data,
        status: "AWAITING_EVIDENCE",
        contributorId: session.user.contributorId,
      });
    }
  }, [
    lock,
    editor,
    taskCommitment,
    taskId,
    session?.user.contributorId,
    setEvidenceHash,
    updateTaskCommitmentEvidence,
    createTaskCommitment
  ]);

  // Effect for handling editability
  useEffect(() => {
    const shouldBeEditable = !taskCommitment
      || (taskCommitment.status
        && editableStatuses.includes(taskCommitment.status));

    setIsEditable(shouldBeEditable);
  }, [taskCommitment, editableStatuses]);

  const handleLockToggle = () => {
    setLock(!lock);
  };

  return (
    <>
      {editor && <ContentEditorSm editor={editor} editable={!lock} />}

      {lock && evidenceHash && (
        <div className="flex w-full items-center justify-center">
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
