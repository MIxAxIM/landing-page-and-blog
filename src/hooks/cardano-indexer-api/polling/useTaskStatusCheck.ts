import { useState, useEffect } from 'react';
import { api } from "~/utils/api";
import { TaskStatus } from "@prisma/client";
import { useTask } from '~/hooks/db/contribution/useTask';

export function useTaskStatusCheck(treasuryNftPolicyId: string) {
	const [isChecking, setIsChecking] = useState(false);
	const [error, setError] = useState<string>();

	const { data: treasuryTasks, isLoading } = api.task.getTreasuryTasks.useQuery({
		treasuryNftPolicyId,
		status: [TaskStatus.PENDING_TX]
	});

	const { updateTaskStatus } = useTask({});

	const { data: treasuryInfo, refetch } = api.treasuryValidator.getTreasuryInfo.useQuery(
		{ treasuryNftPolicyId },
		{
			enabled: !!treasuryNftPolicyId && treasuryNftPolicyId.length === 56,
			refetchInterval: 10000
		}
	);

	useEffect(() => {
		if (!treasuryInfo?.projects || !treasuryTasks) return;

		for (const task of treasuryTasks) {
			if (task.hash && treasuryInfo.projects.some(p => p.project_hash === task.hash)) {
				updateTaskStatus({
					id: task.id,
					status: TaskStatus.ON_CHAIN
				});
			}
		}
	}, [treasuryInfo, treasuryTasks, updateTaskStatus]);

	return { isChecking, error };
}
