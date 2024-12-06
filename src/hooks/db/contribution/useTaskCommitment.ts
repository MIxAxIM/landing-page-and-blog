import { api } from "~/utils/api";
import { type TaskCommitmentStatus } from "@prisma/client";
import toast from "react-hot-toast";
import { type TaskCommitment } from "~/types/db";

type CreateTaskCommitmentInput = {
  taskId: string;
  contributorId: string;
  status?: TaskCommitmentStatus;
  evidence?: Record<string, unknown>;
};

type UpdateTaskCommitmentInput = {
  id: string;
  status?: TaskCommitmentStatus;
  evidence?: Record<string, unknown>;
};

interface UseTaskCommitmentReturn {
  taskCommitment: TaskCommitment | null | undefined;
  taskCommitments: TaskCommitment[];
  isLoading: boolean;
  createTaskCommitment: (data: CreateTaskCommitmentInput) => void;
  updateTaskCommitment: (data: UpdateTaskCommitmentInput) => void;
  deleteTaskCommitment: (id: string) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function useTaskCommitment({
  id,
  taskId,
  contributorId,
  status,
}: {
  id?: string;
  taskId?: string;
  contributorId?: string;
  status?: TaskCommitmentStatus;
}): UseTaskCommitmentReturn {
  const ctx = api.useUtils();

  // Single commitment query
  const { data: taskCommitment, isLoading } = api.taskCommitment.getTaskCommitmentById.useQuery(
    id ?? "",
    { enabled: !!id }
  );

  // List query with filters
  const { data: taskCommitments = [] } = api.taskCommitment.getTaskCommitments.useQuery(
    { taskId, contributorId, status },
    { enabled: !id }
  );

  // Helper function to invalidate and refetch queries
  const refreshQueries = async () => {
    await Promise.all([
      ctx.taskCommitment.getTaskCommitments.invalidate(),
      ctx.task.getTasks.invalidate(),
      id ? ctx.taskCommitment.getTaskCommitmentById.invalidate(id) : Promise.resolve(),
    ]);
  };

  // Mutations
  const createMutation = api.taskCommitment.createTaskCommitment.useMutation({
    onSuccess: async () => {
      toast.success("Commitment created successfully");
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
        toast.error(error.message || "Failed to create commitment");
      }
    },
  });

  const updateMutation = api.taskCommitment.updateTaskCommitment.useMutation({
    onSuccess: async () => {
      toast.success("Commitment updated successfully");
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
        toast.error(error.message || "Failed to update commitment");
      }
    },
  });

  const deleteMutation = api.taskCommitment.deleteTaskCommitment.useMutation({
    onSuccess: async () => {
      toast.success("Commitment deleted successfully");
      await refreshQueries();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete commitment");
    },
  });

  return {
    taskCommitment,
    taskCommitments,
    isLoading,
    createTaskCommitment: createMutation.mutate,
    updateTaskCommitment: updateMutation.mutate,
    deleteTaskCommitment: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  };
}
