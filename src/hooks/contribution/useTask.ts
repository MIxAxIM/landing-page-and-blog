import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { type Task, type TaskStatus } from "@prisma/client";

type CreateTaskInput = {
  escrowId: string;
  task: {
    title: string;
    description: string;
    acceptanceCriteria: string[];
    status?: TaskStatus;
  };
};

type UpdateTaskInput = {
  id: string;
  title?: string;
  description?: string;
  acceptanceCriteria?: string[];
};

type ExtendedTask = Task & {
  escrow?: {
    id: string;
    escrowNftPolicyId: string;
    treasuryId: string;
    contributorPolicyIds: string[];
  };
};

interface UseTaskReturn {
  // Data
  task: ExtendedTask | null | undefined;
  tasks: ExtendedTask[];
  // Loading states
  isLoading: boolean;
  // Mutations
  createTask: (data: CreateTaskInput) => void;
  updateTask: (data: UpdateTaskInput) => void;
  updateTaskStatus: (data: { id: string; status: TaskStatus }) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (data: { taskId: string; targetEscrowId: string }) => void;
  // Mutation states
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isDuplicating: boolean;
}

export function useTask({
  id,
  treasuryNftPolicyId,
  status,
}: {
  id?: string;
  treasuryNftPolicyId?: string;
  status?: TaskStatus[];
}): UseTaskReturn {
  const ctx = api.useUtils();

  // Single task query
  const taskQuery = api.task.getTaskById.useQuery(id ?? "", {
    enabled: !!id,
  });

  // Treasury tasks query with optional status filter
  const treasuryTasksQuery = api.task.getTreasuryTasks.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "", status },
    {
      enabled: !!treasuryNftPolicyId,
    },
  );

  // Helper function to invalidate and refetch all relevant queries
  const refreshQueries = async () => {
    await Promise.all([
      // Always invalidate the general task queries
      ctx.task.getTasks.invalidate(),
      ctx.treasury.getTreasuries.invalidate(),

      // Invalidate specific task if we have an ID
      id ? ctx.task.getTaskById.invalidate(id) : Promise.resolve(),

      // Invalidate treasury tasks if we have a treasury ID
      treasuryNftPolicyId
        ? ctx.task.getTreasuryTasks.invalidate({ treasuryNftPolicyId, status })
        : Promise.resolve(),

      // Invalidate escrow tasks if we have the escrow ID
      taskQuery.data?.escrowId
        ? ctx.task.getEscrowTasks.invalidate(taskQuery.data.escrowId)
        : Promise.resolve(),
    ]);

    // Explicit refetch calls
    if (id) {
      void taskQuery.refetch();
    }
    if (treasuryNftPolicyId) {
      void treasuryTasksQuery.refetch();
    }
  };

  // Mutations
  const createTaskMutation = api.task.createTask.useMutation({
    onSuccess: async () => {
      toast.success("Task created successfully");
      await refreshQueries();
    },
    onError: (error) => {
      const zodErrors = error.data?.zodError?.fieldErrors;
      if (zodErrors) {
        const errorMessages = Object.entries(zodErrors)
          .map(([field, errors]) => `${field}: ${errors?.join(", ")}`)
          .join("\n");
        toast.error(`Validation failed:\n${errorMessages}`);
      } else {
        toast.error(error.message || "Failed to create task");
      }
    },
  });

  const updateTaskMutation = api.task.updateTask.useMutation({
    onSuccess: async () => {
      toast.success("Task updated successfully");
      await refreshQueries();
    },
    onError: (error) => {
      const zodErrors = error.data?.zodError?.fieldErrors;
      if (zodErrors) {
        const errorMessages = Object.entries(zodErrors)
          .map(([field, errors]) => `${field}: ${errors?.join(", ")}`)
          .join("\n");
        toast.error(`Validation failed:\n${errorMessages}`);
      } else {
        toast.error(error.message || "Failed to update task");
      }
    },
  });

  const updateTaskStatusMutation = api.task.updateTaskStatus.useMutation({
    onSuccess: async () => {
      toast.success("Task status updated successfully");
      await refreshQueries();
    },
    onError: (error) => {
      if (error.message.includes("Invalid status transition")) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update task status");
      }
    },
  });

  const deleteTaskMutation = api.task.deleteTask.useMutation({
    onSuccess: async () => {
      toast.success("Task deleted successfully");
      await refreshQueries();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete task");
    },
  });

  const duplicateTaskMutation = api.task.duplicateTask.useMutation({
    onSuccess: async () => {
      toast.success("Task duplicated successfully");
      await refreshQueries();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to duplicate task");
    },
  });

  return {
    task: taskQuery.data ?? null,
    tasks: treasuryTasksQuery.data ?? [],
    isLoading: id ? taskQuery.isLoading : treasuryTasksQuery.isLoading,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    updateTaskStatus: updateTaskStatusMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    duplicateTask: duplicateTaskMutation.mutate,
    isCreating: createTaskMutation.isLoading,
    isUpdating:
      updateTaskMutation.isLoading || updateTaskStatusMutation.isLoading,
    isDeleting: deleteTaskMutation.isLoading,
    isDuplicating: duplicateTaskMutation.isLoading,
  };
}
