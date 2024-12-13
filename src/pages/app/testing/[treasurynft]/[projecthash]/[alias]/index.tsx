import { CardanoWallet } from "@meshsdk/react";
import { blake2b } from "blakejs";
import { Lock } from "lucide-react";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import AddInfoDialog from "~/components/cardano/tx/contributor/add-info/AddInfoDialog";
import CommitProjectDialog from "~/components/cardano/tx/contributor/commit-project/CommitProjectDialog";
import ContentEditorSm from "~/components/editor/ContentEditor/editor-sm";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import { Button } from "~/components/ui/button";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import useEscrowDatum from "~/hooks/cardano-indexer-api/project/useEscrowDatum";
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment";
import { Task, TaskCommitment } from "~/types/db";
import TaskCommitmentStatusIndicator from "~/ui/contribution/status/TaskCommitmentStatusIndicator";
import TaskStatusIndicator from "~/ui/contribution/status/TaskStatusIndicator";
import useTaskCommitmentEditor from "~/ui/contribution/useTaskCommitmentEditor";
import MenuBar from "~/ui/landing/MenuBar";

// TODO:
// 1. Get Contributor add-info working
//  - Save Evidence to TaskCommitment
//  - Run Tx
// 2. Contribution Manager can view Evidence and the on-chain hash, confirming that they are correct
// 3. Once that works, extract components
// 4. And finally apply pattern to commit-project on a route where alias only belongs to Contributor but is not yet in an Escrow UTxO
//
// NOTE:
// - We have updateEvidence and updateStatus for TaskCommitment
// - When Info is added, both need to run - so provided that combined endpoint
//
//
// NOTE:
// - we have a route for Treasury -> Project -> Alias for a current commitment
// - we need Treasury -> Project -> conditional rendering
//  --> which is where a Contributor can commit to this Task
//  -->

export default function ProjectTaskCommitmentPage() {
  const router = useRouter();
  const { treasurynft, projecthash, alias } = router.query;

  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [currentTaskCommitment, setCurrentTaskCommitment] = useState<TaskCommitment | undefined>(undefined);
  const [lock, setLock] = useState(false);
  const [evidenceHash, setEvidenceHash] = useState<string | undefined>(
    undefined,
  );

  // Connected wallet query:
  const { accessTokenAlias } = useAccessToken()

  // Andamio Indexer query:
  const { decodedEscrowDatum } = useEscrowDatum(treasurynft as string, alias as string);

  // Database query:
  const { taskCommitmentsByProjectHash } = useTaskCommitment({ projectHash: projecthash as string });

  useEffect(() => {
    if (!!taskCommitmentsByProjectHash && !!taskCommitmentsByProjectHash[0]) {
      setCurrentTask(taskCommitmentsByProjectHash[0].task)
      setCurrentTaskCommitment(taskCommitmentsByProjectHash[0])
    }
  }, [taskCommitmentsByProjectHash])

  return (
    <DesktopOnlyLayout>
      <MenuBar />
      <div className="flex flex-col items-center justify-center">
        <div
          className="mt-2 max-w-fit transform rounded-lg bg-white p-4 shadow-md transition-transform"
        >
          <h3 className="font-bold">Task Details</h3>
          <div className="max-w-fit grid grid-cols-3">
            <div>
              <p className="text-xs text-slate-500">{currentTask?.title}</p>
              <p className="text-xs text-slate-500">{parseInt(currentTask?.lovelace ?? "0") / 1000000}</p>
              <p className="text-xs text-slate-500">{currentTask?.description}</p>
            </div>
            <div>
              <p>Task Status</p>
              {!!currentTask && <TaskStatusIndicator status={currentTask.status} showLabel />}
              <p>Task Commitment Status</p>
              {!!currentTaskCommitment && <TaskCommitmentStatusIndicator status={currentTaskCommitment.status} showLabel />}
            </div>
            <div>
              {!accessTokenAlias && <CardanoWallet />}
              <div>
                {accessTokenAlias === alias && ("You are the contributor")}
              </div>
              <div>
                {decodedEscrowDatum?.contributorAlias === alias ? ("There is a current commitment here") : ("Not a current commitment")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-1">
        <h3>Enter Submission Details</h3>
        {currentTaskCommitment && (
          <>
            <EditorComponent
              taskCommitment={currentTaskCommitment}
              lock={lock}
              setLock={setLock}
              evidenceHash={evidenceHash}
              setEvidenceHash={setEvidenceHash}
            />
            <AddInfoDialog
              treasuryNftPolicyId={treasurynft as string}
              taskCommitmentId={currentTaskCommitment.id}
              evidenceInfoString={evidenceHash}
            />
          </>
        )}
      </div>

      <div className="flex flex-col gap-y-4">
        <p>Task:</p>
        <pre>{JSON.stringify(currentTask, null, 2)}</pre>
        <p>Escrow Datum:</p>
        <pre>{JSON.stringify(decodedEscrowDatum, null, 2)}</pre>
        <p>Task Commitment:</p>
        <pre>{JSON.stringify(taskCommitmentsByProjectHash, null, 2)}</pre>
      </div>
    </DesktopOnlyLayout >

  )
}

const EditorComponent = ({
  taskCommitment,
  lock,
  setLock,
  evidenceHash,
  setEvidenceHash
}: {
  taskCommitment: TaskCommitment,
  lock: boolean,
  setLock: Dispatch<SetStateAction<boolean>>
  evidenceHash: string | undefined,
  setEvidenceHash: Dispatch<SetStateAction<string | undefined>>
}) => {
  // easier to build the editor after we know the task id!
  const { editor } = useTaskCommitmentEditor(taskCommitment, !lock);
  const { updateTaskCommitmentEvidence } = useTaskCommitment({});

  useEffect(() => {
    if (lock) {
      const data = editor?.getJSON();
      if (data) {
        const hash = blake2b(Buffer.from(JSON.stringify(data)), undefined, 32);
        setEvidenceHash(Buffer.from(hash).toString("hex"));

        updateTaskCommitmentEvidence({
          id: taskCommitment?.id ?? "",
          evidence: data,
        })
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
