import { api } from "~/utils/api";
import { type ContributorPrerequisite } from "~/types/db";
import toast from "react-hot-toast";

interface UseEscrowPrerequisitesReturn {
  escrowPrerequisites: ContributorPrerequisite[];
  isLoading: boolean;
  addPrerequisiteToEscrow: (data: {
    escrowId: string;
    prerequisiteId: string;
  }) => void;
  removePrerequisiteFromEscrow: (data: {
    escrowId: string;
    prerequisiteId: string;
  }) => void;
  isAdding: boolean;
  isRemoving: boolean;
}

export function useEscrowPrerequisites({
  escrowId,
}: {
  escrowId?: string;
}): UseEscrowPrerequisitesReturn {
  const ctx = api.useUtils();

  // Queries
  const { data: escrowPrerequisites = [], isLoading } =
    api.escrow.getEscrowPrerequisites.useQuery(escrowId ?? "", {
      enabled: !!escrowId,
    });

  // Helper function to invalidate and refetch queries
  const refreshQueries = async () => {
    await Promise.all([
      escrowId
        ? ctx.escrow.getEscrowPrerequisites.invalidate(escrowId)
        : Promise.resolve(),
      ctx.escrow.getEscrows.invalidate(),
      ctx.escrow.getEscrowByPolicyId.invalidate(),
      ctx.contributorPrerequisite.getPrerequisites.invalidate(),
    ]);
  };

  // Mutations
  const addPrerequisiteMutation = api.escrow.addPrerequisite.useMutation({
    onSuccess: async () => {
      toast.success("Prerequisite added to escrow");
      await refreshQueries();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add prerequisite to escrow");
    },
  });

  const removePrerequisiteMutation = api.escrow.removePrerequisite.useMutation({
    onSuccess: async () => {
      toast.success("Prerequisite removed from escrow");
      await refreshQueries();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to remove prerequisite from escrow");
    },
  });

  return {
    escrowPrerequisites,
    isLoading,
    addPrerequisiteToEscrow: addPrerequisiteMutation.mutate,
    removePrerequisiteFromEscrow: removePrerequisiteMutation.mutate,
    isAdding: addPrerequisiteMutation.isLoading,
    isRemoving: removePrerequisiteMutation.isLoading,
  };
}
