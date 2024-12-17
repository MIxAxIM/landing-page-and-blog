import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { type Task } from "~/types/db";
import { TaskStatus } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { type SortConfig } from "~/types/sorting";
import { getNestedValue } from "~/hooks/app/useSort";
import { useDebounce } from "~/hooks/app/useDebounce";

const isTaskEditable = (status: TaskStatus) => status === TaskStatus.DRAFT;

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

interface UseTaskReturn {
  // Data
  task: Task | null | undefined;
  tasks: Task[];
  filteredTasks: Task[];
  // Loading states
  isLoading: boolean;
  isLoadingTask: boolean;
  // Mutations
  createTask: (data: CreateTaskInput) => void;
  updateTask: (data: UpdateTaskInput) => void;
  updateTaskStatus: (data: { id: string; status: TaskStatus }) => void;
  updateTaskStatuses: (data: { taskIds: string[]; status: TaskStatus }) => void;
  revertToDraftFromApproved: (id: string) => void;
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
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [debouncedSearch] = useDebounce(searchQuery, 300);


  // Single task query
  const taskQuery = api.task.getTaskById.useQuery(id ?? "", {
    enabled: !!id,
    select: (data) => {
      if (!data) return null;
      return {
        ...data,
        isEditable: isTaskEditable(data.status),
      };
    },
  });

  const { data: allTasksQueryData, isLoading: isLoadingAllTasks } = api.task.getTasks.useQuery({
    search: debouncedSearch,
    status: selectedStatuses,
    limit: 100,
  }, { enabled: !treasuryNftPolicyId && !id })

  // Treasury tasks query - get all tasks first
  const { data: allTreasuryTasksQueryData, isLoading: isLoadingAllTreasuryTasks } =
    api.task.getTreasuryTasks.useQuery(
      { treasuryNftPolicyId: treasuryNftPolicyId ?? "", status: selectedStatuses },
      {
        enabled: !!treasuryNftPolicyId && treasuryNftPolicyId.length === 56,
        select: (data) =>
          data.map((task) => ({
            ...task,
            isEditable: isTaskEditable(task.status),
          })) as Task[],
      },
    );

  useEffect(() => {
    if (isLoadingAllTasks || isLoadingAllTreasuryTasks) {
      setIsLoading(true)
    }

    if (!!allTasksQueryData) {
      setAllTasks(allTasksQueryData.items)
      setIsLoading(false)
    }
    if (!!allTreasuryTasksQueryData) {
      setAllTasks(allTreasuryTasksQueryData)
      setIsLoading(false)
    }
  }, [allTasksQueryData, isLoadingAllTasks, allTreasuryTasksQueryData, isLoadingAllTreasuryTasks])

  // Filter and sort tasks using useMemo
  const processedTasks = useMemo(() => {
    // Filter by escrows (keeping this client-side as it's post-query filtering)
    const filtered = allTasks.filter(
      (task) =>
        selectedEscrows.length === 0 ||
        selectedEscrows.includes(task.escrow?.id ?? ""),
    );

    // Sort
    if (!sortConfig.key) return filtered;

    return [...filtered].sort((a, b) => {
      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Handle numeric values
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        return sortConfig.direction === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      // Handle string values
      const compareResult = String(aValue).localeCompare(String(bValue));
      return sortConfig.direction === "asc" ? compareResult : -compareResult;
    });
  }, [allTasks, selectedEscrows, sortConfig]);

  // Helper function to invalidate and refetch queries
  const refreshQueries = async () => {
    await Promise.all([
      // Invalidate all relevant queries
      ctx.treasury.getTreasuries.invalidate(),
      ctx.task.getTreasuryTasks.invalidate(),
      ctx.escrow.getEscrowById.invalidate(),
      ctx.treasuryOwner.getTreasuryOwnerTreasuries.invalidate(),
      ctx.contributionManager.getContributionManagerTreasuries.invalidate(),
      ctx.treasury.getTreasuryAmountsByStatus.invalidate(),
      treasuryNftPolicyId &&
      ctx.escrow.getTreasuryEscrows.invalidate({ treasuryNftPolicyId: treasuryNftPolicyId }),
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
      toast.success("Task drafted successfully");
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

  // Specific mutation for reverting from APPROVED to DRAFT
  const revertToDraftFromApprovedMutation =
    api.task.revertToDraftFromApproved.useMutation({
      onMutate: async () => {
        const task = taskQuery.data;
        if (task && task.status !== TaskStatus.APPROVED) {
          throw new Error("Only approved tasks can be reverted to draft");
        }
      },
      onSuccess: async () => {
        toast.success("Task reverted to draft status");
        await refreshQueries();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to revert task to draft");
      },
    });

  // Modify updateTask mutation to handle restrictions
  const updateTaskMutation = api.task.updateTask.useMutation({
    onMutate: async () => {
      const task = taskQuery.data;
      if (task && !isTaskEditable(task.status)) {
        throw new Error(
          task.status === TaskStatus.APPROVED
            ? "Task is approved. Revert to draft status first to make changes."
            : "Task cannot be edited in its current status.",
        );
      }
    },
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
        console.log("Invalid status transition updateTaskStatusMutation")
        toast.error(error.message);
      } else {
        toast.error("Failed to update task status");
      }
    },
  });

  const updateTaskStatusesMutation = api.task.updateTaskStatuses.useMutation({
    onSuccess: async () => {
      toast.success("Task statuses updated successfully");
      await refreshQueries();
    },
    onError: (error) => {
      if (error.message.includes("Invalid status transition")) {
        console.log("Invalid status transition updateTaskStatusesMutation")
        toast.error(error.message);
      } else {
        toast.error("Failed to update task status");
      }
    },
  })

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
    isLoading: isLoading,
    isLoadingTask: taskQuery.isLoading,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    updateTaskStatus: updateTaskStatusMutation.mutate,
    updateTaskStatuses: updateTaskStatusesMutation.mutate,
    revertToDraftFromApproved: revertToDraftFromApprovedMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    duplicateTask: duplicateTaskMutation.mutate,
    isCreating: createTaskMutation.isLoading,
    isUpdating:
      updateTaskMutation.isLoading || updateTaskStatusMutation.isLoading,
    isDeleting: deleteTaskMutation.isLoading,
    isDuplicating: duplicateTaskMutation.isLoading,
  };
}
