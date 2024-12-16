import { blake2b } from "blakejs";
import { Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import ContentEditorSm from "~/components/editor/ContentEditor/editor-sm";
import { Button } from "~/components/ui/button";
import { useAssignmentCommitment } from "~/hooks/db/course/useAssignmentCommitment";
import { AssignmentCommitment, TaskCommitment } from "~/types/db";
import useTaskCommitmentEditor from "~/ui/contribution/useTaskCommitmentEditor";

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
  // easier to build the editor after we know the task id!
  const { editor } = useTaskCommitmentEditor({ assignmentCommitment: assignmentCommitment, editable: !lock });
  // TODO: create useAssignmentCommitment hook
  const { updateNetworkEvidence, createAssignmentCommitment } = useAssignmentCommitment({})
  const { data: session } = useSession();

  useEffect(() => {
    if (lock) {
      const data = editor?.getJSON();
      if (data) {
        const hash = blake2b(Buffer.from(JSON.stringify(data)), undefined, 32);
        setEvidenceHash(Buffer.from(hash).toString("hex"));
        if (!!assignmentCommitment) {
          console.log("UPDATING NETWORK EVIDENCE")
          updateNetworkEvidence({
            id: assignmentCommitment?.id ?? "",
            networkEvidence: data,
            networkEvidenceHash: Buffer.from(hash).toString("hex"),
          })

        }
        else {
          createAssignmentCommitment({
            assignmentId: assignmentId ?? "",
            networkEvidence: data,
            networkStatus: !!data ? "PENDING_TX_ADD_INFO" : "PENDING_TX_COMMITMENT_MADE",
            learnerId: session?.user.learnerId ?? "",
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

  return (
    <>
      {!!editor && <ContentEditorSm editor={editor} editable={!lock} />}
      {lock && evidenceHash && (
        <div className="flex items-center justify-center">
          <h5>
            Data Hash: <b>{evidenceHash}</b>
          </h5>
        </div>
      )}
      <div className="flex p-4 items-center justify-center gap-3">
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
      </div>

    </>
  )
}
