import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { type Task, TaskStatus } from "@prisma/client";
import { useMemo } from "react";
import { type SortConfig } from "~/types/sorting";
import { getNestedValue } from "../useSort";

type CreateTaskInput = {
  escrowId: string;
  task: {
    title: string;
    description: string;
    acceptanceCriteria: string[];
    status?: TaskStatus;
    lovelace: string;
    expirationTime: string;
  };
};

type UpdateTaskInput = {
  id: string;
  title?: string;
  description?: string;
  acceptanceCriteria?: string[];
  lovelace: string;
  expirationTime: string;
};

export type ExtendedTask = Task & {
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
  filteredTasks: ExtendedTask[];
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
  selectedStatuses = Object.values(TaskStatus),
  selectedEscrows = [],
  searchQuery = "",
  sortConfig = { key: "index" as const, direction: "asc" as const },
}: {
  id?: string;
  treasuryNftPolicyId?: string;
  selectedStatuses?: TaskStatus[];
  selectedEscrows?: string[];
  searchQuery?: string;
  sortConfig?: SortConfig;
}): UseTaskReturn {
  const ctx = api.useUtils();

  // Single task query
  const taskQuery = api.task.getTaskById.useQuery(id ?? "", {
    enabled: !!id,
  });

  // Treasury tasks query - get all tasks first
  const { data: allTasks = [], isLoading } = api.task.getTreasuryTasks.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "" },
    {
      enabled: !!treasuryNftPolicyId,
    },
  );

  // Filter and sort tasks using useMemo
  const processedTasks = useMemo(() => {
    // First filter
    const filtered = allTasks.filter(
      (task) =>
        selectedStatuses.includes(task.status) &&
        (selectedEscrows.length === 0 ||
          selectedEscrows.includes(task.escrow?.id ?? "")),
    );

    // Then filter by search query
    const searchFiltered = searchQuery.trim()
      ? filtered.filter((task) => {
          const searchLower = searchQuery.toLowerCase();
          return (
            task.title.toLowerCase().includes(searchLower) ||
            task.description.toLowerCase().includes(searchLower) ||
            task.acceptanceCriteria.some((criteria) =>
              criteria.toLowerCase().includes(searchLower),
            )
          );
        })
      : filtered;

    // Then sort
    if (!sortConfig.key) return searchFiltered;

    return [...searchFiltered].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Handle numeric values (including string representations)
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        return sortConfig.direction === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      // Handle string values
      const compareResult = String(aValue).localeCompare(String(bValue));
      return sortConfig.direction === "asc" ? compareResult : -compareResult;
    });
  }, [allTasks, selectedStatuses, selectedEscrows, searchQuery, sortConfig]);

  // Helper function to invalidate and refetch queries
  const refreshQueries = async () => {
    await Promise.all([
      // Invalidate all relevant queries
      ctx.task.getTasks.invalidate(),
      ctx.treasury.getTreasuries.invalidate(),
      ctx.task.getTreasuryTasks.invalidate(),
      // If we have a specific task ID, invalidate that too
      id ? ctx.task.getTaskById.invalidate(id) : Promise.resolve(),
      // If we have a treasury ID, invalidate that specific query
      treasuryNftPolicyId
        ? ctx.task.getTreasuryTasks.invalidate({ treasuryNftPolicyId })
        : Promise.resolve(),
    ]);
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
    tasks: allTasks,
    filteredTasks: processedTasks,
    isLoading,
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
