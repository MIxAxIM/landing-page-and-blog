import { api } from "~/utils/api";
import { TaskStatus } from "@prisma/client";

export function useTaskBoard(escrowId?: string) {
  const { data: tasks, isLoading } = api.task.getEscrowTasks.useQuery(
    escrowId ?? "",
    { enabled: !!escrowId },
  );

  // Group tasks by status
  const tasksByStatus = tasks?.reduce(
    (acc, task) => {
      const status = task.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    },
    {} as Record<TaskStatus, typeof tasks>,
  );

  return {
    tasksByStatus,
    isLoading,
    statusColumns: Object.values(TaskStatus),
  };
}
