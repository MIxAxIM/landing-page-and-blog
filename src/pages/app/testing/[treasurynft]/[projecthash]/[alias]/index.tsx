import { blake2b } from "blakejs";
import { Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CommitProjectDialog from "~/components/cardano/tx/contributor/commit-project/CommitProjectDialog";
import ContentEditorSm from "~/components/editor/ContentEditor/editor-sm";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import { Button } from "~/components/ui/button";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import useEscrowDatum from "~/hooks/cardano-indexer-api/project/useEscrowDatum";
import { useTask } from "~/hooks/db/contribution/useTask";
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment";
import { Task } from "~/types/db";
import useTaskCommitmentEditor from "~/ui/contribution/useTaskCommitmentEditor";
import MenuBar from "~/ui/landing/MenuBar";

export default function ProjectTaskCommitmentPage() {
  const router = useRouter();
  const { treasurynft, projecthash, alias } = router.query;

  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [lock, setLock] = useState(false);
  const [evidenceHash, setEvidenceHash] = useState<string | undefined>(
    undefined,
  );

  const { tasks } = useTask({ treasuryNftPolicyId: treasurynft as string });
  const { accessTokenAlias } = useAccessToken()

  // TODO: Start here 2024-12-13
  // Note that DecodedEscrowUtxo has the contributor alias already -- use it, or check with Nelson about adding to decoded-datum endpoint
  const { decodedEscrowDatum } = useEscrowDatum(treasurynft as string, alias as string);

  const { taskCommitments } = useTaskCommitment({ taskId: currentTask?.id ?? "" });

  useEffect(() => {
    if (typeof projecthash === 'string' && tasks && tasks.length > 0) {
      const task = tasks.find((task) => task.hash === projecthash);
      if (task) {
        setCurrentTask(task);
      }
    }

  }, [projecthash, tasks])

  //if (!decodedEscrowDatum || !decodedEscrowDatum[0]) return

  return (
    <DesktopOnlyLayout>
      <MenuBar />
      <div className="flex flex-col items-center justify-center">
        <div
          className="mt-2 max-w-fit transform rounded-lg bg-white p-4 shadow-md transition-transform"
        >
          <h3 className="font-bold">Task Details</h3>
          <div className="max-w-fit truncate">
            <span className="text-xs text-slate-500">{currentTask?.title}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <p>Contributor: {accessTokenAlias} does or does not match {alias}</p>
        <p>Task:</p>
        <pre>{JSON.stringify(currentTask, null, 2)}</pre>
        <p>Escrow Datum:</p>
        <pre>{JSON.stringify(decodedEscrowDatum, null, 2)}</pre>
        <p>Task Commitment:</p>
        <pre>{JSON.stringify(taskCommitments, null, 2)}</pre>
      </div>


      <div className="flex flex-col items-center justify-center p-1">
        <h3>Enter Submission Details</h3>
      </div>
      <EditorComponent
        taskCommitmentId={currentTask?.id ?? ""}
        lock={lock}
        setLock={setLock}
        evidenceHash={evidenceHash}
        setEvidenceHash={setEvidenceHash}
      />

      <div>
        <CommitProjectDialog
          treasuryNftPolicyId={treasurynft as string}
          taskId={currentTask?.id ?? ""}
          info={evidenceHash}
          disabled={!lock}
        />
      </div>
    </DesktopOnlyLayout >

  )
}

const EditorComponent = ({
  taskCommitmentId,
  lock,
  setLock,
  evidenceHash,
  setEvidenceHash
}: {
  taskCommitmentId: string,
  lock: boolean,
  setLock: Dispatch<SetStateAction<boolean>>
  evidenceHash: string | undefined,
  setEvidenceHash: Dispatch<SetStateAction<string | undefined>>
}) => {
  // easier to build the editor after we know the task id!
  const { editor } = useTaskCommitmentEditor(taskCommitmentId, !lock);

  useEffect(() => {
    if (lock) {
      const data = editor?.getJSON();
      if (data) {
        const hash = blake2b(Buffer.from(JSON.stringify(data)), undefined, 32);
        setEvidenceHash(Buffer.from(hash).toString("hex"));
      }
    }
  }, [lock]);

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
