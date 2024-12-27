import { CardanoWallet } from "@meshsdk/react";
import { useEffect, useState } from "react";
import AddInfoDialog from "~/components/cardano/tx/contributor/add-info/AddInfoDialog";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import useEscrowDatum from "~/hooks/cardano-indexer-api/project/useEscrowDatum";
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment";
import type { Task, TaskCommitment } from "~/types/db";
import TaskEvidenceEditor from "./TaskEvidenceEditor";
import CommitProjectDialog from "~/components/cardano/tx/contributor/commit-project/CommitProjectDialog";
import { useTask } from "~/hooks/db/contribution/useTask";
import { Card } from "~/components/ui/card";
import GetRewardsDialog from "~/components/cardano/tx/contributor/get-rewards/GetRewardsDialog";
import TaskStatusIndicator from "../status/TaskStatusIndicator";

export default function TaskCommitmentComponent({
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
      const _task = tasks.find(task => task.taskHash === projectHash)
      setCurrentTask(_task)
    }
  }, [tasks, projectHash])

  useEffect(() => {
    if (currentTaskCommitment?.status != "AWAITING_EVIDENCE") {
      setLock(true)
    }
  }, [currentTaskCommitment])

  return (
    <div className="flex flex-col mx-auto mb-24 w-full space-y-10">
      <div>
        {!accessTokenAlias && <CardanoWallet />}
      </div>


      <div className="grid grid-cols-4 w-full gap-4">
        <div className="col-span-4 flex flex-row items-center justify-between w-full">
          <h3>Share Evidence and Commit to this Task</h3>
          {!!currentTask && (
            <TaskStatusIndicator
              status={currentTask.status}
              numAllowedCommitments={currentTask.numAllowedCommitments}
              taskCommitments={currentTask.taskCommitments}
              showLabel
            />
          )}
        </div>


        {decodedEscrowDatum?.contributorAlias === alias && (
          <Card className="col-span-4 flex flex-col justify-between items-center w-full">
            {!accessTokenAlias && <CardanoWallet />}
            <div>
              <p>
                You are committed to this task
              </p>
              {!!currentTaskCommitment && (
                <div>
                  <GetRewardsDialog
                    treasuryNftPolicyId={treasuryNftPolicyId} taskCommitmentId={currentTaskCommitment.id} />
                </div>
              )}
            </div>
          </Card>
        )}

        <Card className="col-span-4 flex flex-col justify-between items-center w-full">
          <h3>Enter Submission Details</h3>
          {currentTaskCommitment ? (
            <>
              <TaskEvidenceEditor
                taskCommitment={currentTaskCommitment}
                lock={lock}
                setLock={setLock}
                evidenceHash={evidenceHash}
                setEvidenceHash={setEvidenceHash}
              />
            </>
          ) : (
            <>
              <TaskEvidenceEditor
                taskId={currentTask?.id ?? ""}
                lock={lock}
                setLock={setLock}
                evidenceHash={evidenceHash}
                setEvidenceHash={setEvidenceHash}
              />
            </>
          )}
          {decodedEscrowDatum && currentTaskCommitment?.status === "AWAITING_EVIDENCE" && (
            <>
              <AddInfoDialog
                treasuryNftPolicyId={treasuryNftPolicyId}
                taskCommitmentId={currentTaskCommitment?.id ?? ""}
                evidenceInfoString={evidenceHash}
              />
            </>
          )}
          {lock && currentTaskCommitment?.status === "AWAITING_EVIDENCE" && (
            <>
              <CommitProjectDialog
                treasuryNftPolicyId={treasuryNftPolicyId ?? ""}
                taskCommitmentId={currentTaskCommitment?.id} taskId={currentTask?.id ?? ""}
                disabled={false}
                info={evidenceHash}
              />
            </>
          )}
        </Card>

      </div>
    </div>

  )
}
