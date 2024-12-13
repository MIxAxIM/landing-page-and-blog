import { api } from "~/utils/api";
import { TaskCommitmentStatus } from "@prisma/client";
import toast from "react-hot-toast";
import { type TaskCommitment } from "~/types/db";

type CreateTaskCommitmentInput = {
  taskId: string;
  contributorId: string;
  status: "PENDING_TX_COMMITMENT_MADE" | "PENDING_TX_ADD_INFO";
  evidence?: Record<string, unknown>;
};

type UpdateTaskCommitmentEvidenceInput = {
  id: string;
  status?: TaskCommitmentStatus;
  evidence?: Record<string, unknown>;
};


type UpdateTaskCommitmentStatusInput = {
  id: string;
  status: TaskCommitmentStatus;
};

interface UseTaskCommitmentReturn {
  taskCommitment: TaskCommitment | null | undefined;
  taskCommitments: TaskCommitment[];
  taskCommitmentsByTreasury: TaskCommitment[];
  taskCommitmentsByProjectHash: TaskCommitment[];
  isLoading: boolean;
  createTaskCommitment: (data: CreateTaskCommitmentInput) => void;
  updateTaskCommitmentEvidence: (data: UpdateTaskCommitmentEvidenceInput) => void;
  updateTaskCommitmentStatus: (data: UpdateTaskCommitmentStatusInput) => void;
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
  treasuryNftPolicyId,
  projectHash,
}: {
  id?: string;
  taskId?: string;
  contributorId?: string;
  status?: TaskCommitmentStatus;
  treasuryNftPolicyId?: string;
  projectHash?: string;
}): UseTaskCommitmentReturn {
  const ctx = api.useUtils();

  // Single commitment queries
  const { data: taskCommitment, isLoading } = api.taskCommitment.getTaskCommitmentById.useQuery(
    id ?? "",
    { enabled: !!id }
  );

  const { data: taskCommitmentsByProjectHash = [] } = api.taskCommitment.getTaskCommitmentsByProjectHash.useQuery(
    projectHash ?? "",
    { enabled: !!projectHash }
  );


  // List query with filters
  const { data: taskCommitments = [] } = api.taskCommitment.getTaskCommitments.useQuery(
    { taskId, contributorId, status },
    { enabled: !id }
  );


  // Get all Commitments for a Treasury
  const { data: taskCommitmentsByTreasury = [] } = api.taskCommitment.getTaskCommitmentsByTreasury.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "" },
    { enabled: !!treasuryNftPolicyId }
  );

  // Helper function to invalidate and refetch queries
  const refreshQueries = async () => {
    await Promise.all([
      ctx.taskCommitment.getTaskCommitments.invalidate(),
      ctx.task.getTasks.invalidate(),
      ctx.escrow.getEscrowById.invalidate(),
      ctx.escrow.getEscrowByPolicyId.invalidate(),
      ctx.treasuryValidator.getTreasuryInfo.invalidate(),
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

  const updateTaskCommitmentEvidenceMutation = api.taskCommitment.updateTaskCommitmentEvidence.useMutation({
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

  const updateTaskCommitmentStatusMutation = api.taskCommitment.updateTaskCommitmentStatus.useMutation({
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
    taskCommitmentsByTreasury,
    taskCommitmentsByProjectHash,
    isLoading,
    createTaskCommitment: createMutation.mutate,
    updateTaskCommitmentEvidence: updateTaskCommitmentEvidenceMutation.mutate,
    updateTaskCommitmentStatus: updateTaskCommitmentStatusMutation.mutate,
    deleteTaskCommitment: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateTaskCommitmentEvidenceMutation.isLoading || updateTaskCommitmentStatusMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  };
}
