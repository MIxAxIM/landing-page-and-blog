import { api } from "~/utils/api";
import { type EscrowContributorPrerequisites } from "~/types/db";
import toast from "react-hot-toast";

interface UseEscrowPrerequisitesReturn {
  escrowPrerequisites: EscrowContributorPrerequisites[];
  prerequisiteEscrows: EscrowContributorPrerequisites[];
  isLoading: boolean;
  addPrerequisiteToEscrow: (data: {
    escrowId: string;
    contributorPrerequisiteId: string;
  }) => void;
  removePrerequisiteFromEscrow: (data: {
    escrowId: string;
    contributorPrerequisiteId: string;
  }) => void;
  isAdding: boolean;
  isRemoving: boolean;
}

export function useEscrowPrerequisites({
  escrowId,
  prerequisiteId,
}: {
  escrowId?: string;
  prerequisiteId?: string;
}): UseEscrowPrerequisitesReturn {
  const ctx = api.useUtils();

  // Queries
  const { data: escrowPrerequisites = [], isLoading: isLoadingEscrowPrereqs } =
    api.escrowContributorPrerequisites.getEscrowPrerequisites.useQuery(
      escrowId ?? "",
      {
        enabled: !!escrowId,
      },
    );

  const { data: prerequisiteEscrows = [], isLoading: isLoadingPrereqEscrows } =
    api.escrowContributorPrerequisites.getPrerequisiteEscrows.useQuery(
      prerequisiteId ?? "",
      {
        enabled: !!prerequisiteId,
      },
    );

  // Helper function to invalidate and refetch queries
  const refreshQueries = async () => {
    await Promise.all([
      escrowId
        ? ctx.escrowContributorPrerequisites.getEscrowPrerequisites.invalidate(
            escrowId,
          )
        : Promise.resolve(),
      prerequisiteId
        ? ctx.escrowContributorPrerequisites.getPrerequisiteEscrows.invalidate(
            prerequisiteId,
          )
        : Promise.resolve(),
      ctx.escrow.getEscrows.invalidate(),
      ctx.contributorPrerequisite.getPrerequisites.invalidate(),
    ]);
  };

  // Mutations
  const addPrerequisiteMutation =
    api.escrowContributorPrerequisites.addPrerequisiteToEscrow.useMutation({
      onSuccess: async () => {
        toast.success("Prerequisite added to escrow");
        await refreshQueries();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to add prerequisite to escrow");
      },
    });

  const removePrerequisiteMutation =
    api.escrowContributorPrerequisites.removePrerequisiteFromEscrow.useMutation(
      {
        onSuccess: async () => {
          toast.success("Prerequisite removed from escrow");
          await refreshQueries();
        },
        onError: (error) => {
          toast.error(
            error.message || "Failed to remove prerequisite from escrow",
          );
        },
      },
    );

  return {
    escrowPrerequisites,
    prerequisiteEscrows,
    isLoading: isLoadingEscrowPrereqs || isLoadingPrereqEscrows,
    addPrerequisiteToEscrow: addPrerequisiteMutation.mutate,
    removePrerequisiteFromEscrow: removePrerequisiteMutation.mutate,
    isAdding: addPrerequisiteMutation.isLoading,
    isRemoving: removePrerequisiteMutation.isLoading,
  };
}
