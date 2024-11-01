import { api } from "~/utils/api";

export function useTaskMutations(escrowId?: string) {
  const ctx = api.useUtils();

  const createTask = api.task.createTask.useMutation({
    onSuccess: () => {
      void ctx.task.getEscrowTasks.invalidate(escrowId);
    },
  });

  const deleteTask = api.task.deleteTask.useMutation({
    onSuccess: () => {
      void ctx.task.getEscrowTasks.invalidate(escrowId);
    },
  });

  const duplicateTask = api.task.duplicateTask.useMutation({
    onSuccess: () => {
      void ctx.task.getEscrowTasks.invalidate(escrowId);
    },
  });

  return {
    createTask: createTask.mutate,
    deleteTask: deleteTask.mutate,
    duplicateTask: duplicateTask.mutate,
    isLoading:
      createTask.isLoading || deleteTask.isLoading || duplicateTask.isLoading,
  };
}
