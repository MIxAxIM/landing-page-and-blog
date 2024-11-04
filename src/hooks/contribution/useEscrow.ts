import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { type Escrow } from "~/types/db";

type CreateEscrowInput = {
  title?: string;
  escrowNftPolicyId: string;
  contributorPolicyIds: string[];
  treasuryId: string;
};

type UpdateEscrowInput = {
  title: string;
  id: string;
  escrowNftPolicyId?: string;
  contributorPolicyIds?: string[];
  isSyncedWithNetwork: false;
};

interface UseEscrowReturn {
  escrow: Escrow | null | undefined;
  escrows: Escrow[];
  treasuryEscrows: Escrow[];
  isLoading: boolean;
  createEscrow: (data: CreateEscrowInput) => void;
  updateEscrow: (data: UpdateEscrowInput) => void;
  updateEscrowSyncStatus: (data: {
    id: string;
    isSyncedWithNetwork: boolean;
  }) => void;
  deleteEscrow: (id: string) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  numUnusedTreasuryEscrows: number;
}

export function useEscrow({
  id,
  treasuryNftPolicyId,
}: {
  id?: string;
  treasuryNftPolicyId?: string;
}): UseEscrowReturn {
  const ctx = api.useUtils();

  // Single escrow query
  const escrowQuery = api.escrow.getEscrowById.useQuery(id ?? "", {
    enabled: !!id,
  });

  // All escrows query
  const allEscrowsQuery = api.escrow.getEscrows.useQuery(undefined, {
    enabled: !id,
  });

  // Treasury escrows query
  const treasuryEscrowsQuery = api.escrow.getTreasuryEscrows.useQuery(
    treasuryNftPolicyId ?? "",
    { enabled: !!treasuryNftPolicyId },
  );

  // Helper function to invalidate and refetch queries
  const refreshQueries = async () => {
    await Promise.all([
      ctx.escrow.getEscrows.invalidate(),
      ctx.treasury.getTreasuries.invalidate(),
      ctx.escrow.getTreasuryEscrows.invalidate(),
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

  const updateEscrowSyncStatus = api.escrow.updateEscrowSyncStatus.useMutation({
    onSuccess: async () => {
      toast.success("Escrow is synced with Andamio Network");
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
    escrow: escrowQuery.data,
    escrows: allEscrowsQuery.data ?? [],
    treasuryEscrows: treasuryEscrowsQuery.data ?? [],
    isLoading: id ? escrowQuery.isLoading : allEscrowsQuery.isLoading,
    createEscrow: createEscrowMutation.mutate,
    updateEscrow: updateEscrowMutation.mutate,
    updateEscrowSyncStatus: updateEscrowSyncStatus.mutate,
    deleteEscrow: deleteEscrowMutation.mutate,
    isCreating: createEscrowMutation.isLoading,
    isUpdating: updateEscrowMutation.isLoading,
    isDeleting: deleteEscrowMutation.isLoading,
    numUnusedTreasuryEscrows:
      treasuryEscrowsQuery.data?.filter((escrow) => !escrow.title).length ?? 0,
  };
}
