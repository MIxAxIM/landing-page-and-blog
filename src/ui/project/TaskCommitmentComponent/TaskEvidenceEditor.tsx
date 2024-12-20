import { TaskCommitmentStatus } from "@prisma/client";
import { blake2b } from "blakejs";
import { Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ContentEditorSm from "~/components/editor/ContentEditor/editor-sm";
import { Button } from "~/components/ui/button";
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment";
import { TaskCommitment } from "~/types/db";
import useTaskCommitmentEditor from "~/ui/contribution/useTaskCommitmentEditor";

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
  // easier to build the editor after we know the task id!
  const { editor } = useTaskCommitmentEditor({ taskCommitment: taskCommitment, editable: !lock });
  const { createTaskCommitment, updateTaskCommitmentEvidence } = useTaskCommitment({});
  const { data: session } = useSession();
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    if (lock) {
      const data = editor?.getJSON();
      if (data) {
        const hash = blake2b(Buffer.from(JSON.stringify(data)), undefined, 32);
        setEvidenceHash(Buffer.from(hash).toString("hex"));
        if (!!taskCommitment) {
          updateTaskCommitmentEvidence({
            id: taskCommitment?.id ?? "",
            evidence: data,
          })

        }
        else if (taskId) {
          createTaskCommitment({
            taskId: taskId,
            evidence: data,
            status: "AWAITING_EVIDENCE",
            contributorId: session?.user.contributorId ?? "",
          })
        }
      }
    }
  }, [lock, editor]);

  function lockEditor() {
    if (lock) {
      setLock(false);
      return;
    }
    setLock(true);
  }


  const editableStatuses: TaskCommitmentStatus[] = [
    "AWAITING_EVIDENCE",
    "COMMITMENT_DENIED",
    "UNLOCKED_BY_CONTRIBUTOR"
  ]

  useEffect(() => {
    if (!!taskCommitment?.status && editableStatuses.includes(taskCommitment?.status)) {
      setIsEditable(true);
    }
    else if (!taskCommitment) {
      setIsEditable(true);
    }
    else {
      setIsEditable(false);
    }

  }, [taskCommitment])


  return (
    <>
      {!!editor && <ContentEditorSm editor={editor} editable={!lock} />}
      {lock && evidenceHash && (
        <div className="flex w-full items-center justify-center">
          <h5>
            Data Hash: <b>{evidenceHash}</b>
          </h5>
        </div>
      )}
      <div className="flex p-4 items-center justify-center gap-3">
        {isEditable && (
          <div>
            <Button
              className={`rounded-md text-white ${lock ? "bg-slate-500" : "bg-blue-500"}`}
              onClick={lockEditor}
            >
              {lock ? (
                <>
                  <Lock />" Unlock"
                </>
              ) : (
                "Lock"
              )}
            </Button>
          </div>
        )}
      </div>

    </>
  )
}
