import { useState, useEffect } from 'react';
import { api } from "~/utils/api";
import { TaskStatus } from "@prisma/client";
import { useTask } from '~/hooks/db/contribution/useTask';

export function useTaskStatusCheck(treasuryNftPolicyId: string) {
  const [isChecking, setIsChecking] = useState(false);

  // Get all tasks with PENDING_TX status
  const { data: pendingTaskTxs, isLoading } = api.task.getTreasuryTasks.useQuery({
    treasuryNftPolicyId,
    status: [TaskStatus.PENDING_TX]
  });

  // Task mutation
  const { updateTaskStatus } = useTask({});

  // Source of cardano on-chain data
  const { data: treasuryInfo } = api.treasuryValidator.getTreasuryInfo.useQuery(
    { treasuryNftPolicyId },
    {
      enabled: !!treasuryNftPolicyId && treasuryNftPolicyId.length === 56 && !!pendingTaskTxs && pendingTaskTxs.length > 0,
      refetchInterval: 10000
    }
  );

  useEffect(() => {
    if (!treasuryInfo?.projects || !pendingTaskTxs) return;

    // If on-chain data has tasks and there are tasks in DB with PENDING_TX status, check if the task is on-chain
    setIsChecking(true);

    // The task hash was calculated when the tx was submitted on-chain
    // If we can find it in the on-chain data, we can update the task status to ON_CHAIN in the DB
    for (const task of pendingTaskTxs) {
      if (task.hash && treasuryInfo.projects.some(p => p.project_hash === task.hash)) {
        updateTaskStatus({
          id: task.id,
          status: TaskStatus.ON_CHAIN
        });
      }
    }
  }, [treasuryInfo, pendingTaskTxs, updateTaskStatus]);

  return { isChecking, isLoading };
}
