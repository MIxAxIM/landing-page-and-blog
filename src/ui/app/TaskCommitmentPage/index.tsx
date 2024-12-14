
import { CardanoWallet } from "@meshsdk/react";
import { useEffect, useState } from "react";
import AddInfoDialog from "~/components/cardano/tx/contributor/add-info/AddInfoDialog";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import useEscrowDatum from "~/hooks/cardano-indexer-api/project/useEscrowDatum";
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment";
import { Task, TaskCommitment } from "~/types/db";
import TaskStatusIndicator from "~/ui/contribution/status/TaskStatusIndicator";
import EvidenceEditor from "./EvidenceEditor";
import CommitProjectDialog from "~/components/cardano/tx/contributor/commit-project/CommitProjectDialog";
import { useTask } from "~/hooks/db/contribution/useTask";

// TODO:
// What happens when connected wallet is not the contributor (yet!) to this task?
// There will not be Escrow Datum...so we must get info about the task from somewhere else
// ...however, we still want to store the evidence...

export default function TaskCommitmentPage({
  treasuryNftPolicyId,
  projectHash,
  alias,
}: {
  treasuryNftPolicyId: string,
  projectHash: string,
  alias?: string
}) {
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [currentTaskCommitment, setCurrentTaskCommitment] = useState<TaskCommitment | undefined>(undefined);
  const [lock, setLock] = useState(false);
  const [evidenceHash, setEvidenceHash] = useState<string | undefined>(
    undefined,
  );

  // Connected wallet query:
  const { accessTokenAlias } = useAccessToken()

  // Andamio Indexer query:
  const { decodedEscrowDatum } = useEscrowDatum(treasuryNftPolicyId, alias ?? accessTokenAlias);

  // Database query:
  const { taskCommitmentsByProjectHash } = useTaskCommitment({ projectHash: projectHash });
  const { tasks } = useTask({ treasuryNftPolicyId: treasuryNftPolicyId });

  useEffect(() => {
    if (!!taskCommitmentsByProjectHash && !!taskCommitmentsByProjectHash[0]) {
      setCurrentTask(taskCommitmentsByProjectHash[0].task)
      setCurrentTaskCommitment(taskCommitmentsByProjectHash[0])
    }
  }, [taskCommitmentsByProjectHash])

  useEffect(() => {
    if (!!tasks && !!tasks[0]) {
      const _task = tasks.find(task => task.hash === projectHash)
      setCurrentTask(_task)
    }
  }, [tasks, projectHash])

  return (
    <div>

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
              {!!currentTask && (
                <TaskStatusIndicator
                  status={currentTask.status}
                  numAllowedCommitments={currentTask.numAllowedCommitments}
                  taskCommitments={currentTask.taskCommitments}
                  showLabel
                />
              )}
            </div>
            <div>
              {!accessTokenAlias && <CardanoWallet />}
              <div>
                {decodedEscrowDatum?.contributorAlias === alias ? ("There is a current commitment here") : ("Not a current commitment")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center p-1">
        <h3>Enter Submission Details</h3>
        {currentTaskCommitment ? (
          <>
            <EvidenceEditor
              taskCommitment={currentTaskCommitment}
              lock={lock}
              setLock={setLock}
              evidenceHash={evidenceHash}
              setEvidenceHash={setEvidenceHash}
            />
          </>
        ) : (
          <>
            <EvidenceEditor
              taskId={currentTask?.id ?? ""}
              lock={lock}
              setLock={setLock}
              evidenceHash={evidenceHash}
              setEvidenceHash={setEvidenceHash}
            />
          </>
        )}
        {decodedEscrowDatum ? (
          <>
            <AddInfoDialog
              treasuryNftPolicyId={treasuryNftPolicyId}
              taskCommitmentId={currentTaskCommitment?.id ?? ""}
              evidenceInfoString={evidenceHash}
            />
          </>
        ) : (
          <>
            <CommitProjectDialog treasuryNftPolicyId={treasuryNftPolicyId ?? ""} taskCommitmentId={currentTaskCommitment?.id} taskId={currentTask?.id ?? ""} disabled={false} />
          </>
        )}
      </div>

    </div>

  )
}
