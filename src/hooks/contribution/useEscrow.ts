import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { type Escrow, type Task } from "@prisma/client";

type CreateEscrowInput = {
  title: string;
  escrowNftPolicyId: string;
  contributorPolicyIds: string[];
  treasuryId: string;
};

type UpdateEscrowInput = {
  title: string;
  id: string;
  escrowNftPolicyId?: string;
  contributorPolicyIds?: string[];
};

type ExtendedEscrow = Escrow & {
  name: string;
  tasks: Task[];
  treasury?: {
    title: string;
    treasuryNftPolicyId: string;
  };
};

interface UseEscrowReturn {
  escrow: ExtendedEscrow | null | undefined;
  escrows: ExtendedEscrow[];
  isLoading: boolean;
  createEscrow: (data: CreateEscrowInput) => void;
  updateEscrow: (data: UpdateEscrowInput) => void;
  deleteEscrow: (id: string) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function useEscrow({ id }: { id?: string }): UseEscrowReturn {
  const ctx = api.useUtils();

  // Single escrow query
  const escrowQuery = api.escrow.getEscrowById.useQuery(id ?? "", {
    enabled: !!id,
  });

  // All escrows query
  const allEscrowsQuery = api.escrow.getEscrows.useQuery(undefined, {
    enabled: !id,
  });

  // Helper function to invalidate and refetch queries
  const refreshQueries = async () => {
    await Promise.all([
      ctx.escrow.getEscrows.invalidate(),
      ctx.treasury.getTreasuries.invalidate(),
      id ? ctx.escrow.getEscrowById.invalidate(id) : Promise.resolve(),
    ]);

    // Explicit refetch calls
    if (!id) {
      void allEscrowsQuery.refetch();
    } else {
      void escrowQuery.refetch();
    }
  };

  const createEscrowMutation = api.escrow.createEscrow.useMutation({
    onSuccess: async () => {
      toast.success("Escrow created successfully");
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
        toast.error(error.message || "Failed to create escrow");
      }
    },
  });

  const updateEscrowMutation = api.escrow.updateEscrow.useMutation({
    onSuccess: async () => {
      toast.success("Escrow updated successfully");
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
        toast.error(error.message || "Failed to update escrow");
      }
    },
  });

  const deleteEscrowMutation = api.escrow.deleteEscrow.useMutation({
    onSuccess: async () => {
      toast.success("Escrow deleted successfully");
      await refreshQueries();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete escrow");
    },
  });

  return {
    escrow: escrowQuery.data
      ? ({
          ...escrowQuery.data,
        } as ExtendedEscrow)
      : null,
    escrows: (allEscrowsQuery.data ?? []).map((e) => ({
      ...e,
    })) as ExtendedEscrow[],
    isLoading: id ? escrowQuery.isLoading : allEscrowsQuery.isLoading,
    createEscrow: createEscrowMutation.mutate,
    updateEscrow: updateEscrowMutation.mutate,
    deleteEscrow: deleteEscrowMutation.mutate,
    isCreating: createEscrowMutation.isLoading,
    isUpdating: updateEscrowMutation.isLoading,
    isDeleting: deleteEscrowMutation.isLoading,
  };
}
