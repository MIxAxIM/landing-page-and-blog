import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { type Treasury } from "~/types/db";
import { useState } from "react";

interface UseTreasuryReturn {
  treasury: Treasury | null | undefined;
  isLoading: boolean;
  createTreasury: (data: {
    treasuryNftPolicyId?: string;
    title: string;
    treasuryOwnerId: string;
  }) => void;
  updateTreasury: (data: {
    id: string;
    title?: string;
  }) => void;
  deleteTreasury: (id: string) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  treasuryError: string | null;
}

export function useTreasury(id?: string): UseTreasuryReturn {
  const ctx = api.useUtils();
  const [appError, setAppError] = useState<string | null>(null)

  // Query for getting treasury data
  const { data: treasury, isLoading } = api.treasury.getTreasuryById.useQuery(
    id ?? "",
    { enabled: !!id },
  );

  // Mutation for creating a new treasury
  const createTreasuryMutation = api.treasury.createTreasury.useMutation({
    onSuccess: () => {
      toast.success("Treasury created!");
      // Invalidate both the specific treasury and the full treasury list
      if (id) void ctx.treasury.getTreasuryById.invalidate(id);
      void ctx.treasury.getTreasuries.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Some inputs are missing or invalid");

      } else if (!!e.shape?.message) {
        toast.error(e.shape.message)
        setAppError(e.shape.message)
      } else {
        toast.error(JSON.stringify(e));
      }
    },
  });

  // Mutation for updating a treasury
  const updateTreasuryMutation = api.treasury.updateTreasury.useMutation({
    onSuccess: () => {
      toast.success("Treasury updated!");
      // Invalidate both the specific treasury and the full treasury list
      if (id) void ctx.treasury.getTreasuryById.invalidate(id);
      void ctx.treasury.getTreasuries.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Some inputs are missing or invalid");
      } else {
        toast.error("Failed to update treasury");
      }
    },
  });

  // Mutation for deleting a treasury
  const deleteTreasuryMutation = api.treasury.deleteTreasury.useMutation({
    onSuccess: () => {
      toast.success("Treasury deleted!");
      void ctx.treasury.getTreasuries.invalidate();
    },
    onError: () => {
      toast.error("Failed to delete treasury");
    },
  });

  return {
    treasury,
    isLoading,
    createTreasury: createTreasuryMutation.mutate,
    updateTreasury: updateTreasuryMutation.mutate,
    deleteTreasury: deleteTreasuryMutation.mutate,
    isCreating: createTreasuryMutation.isLoading,
    isUpdating: updateTreasuryMutation.isLoading,
    isDeleting: deleteTreasuryMutation.isLoading,
    treasuryError: appError,
  };
}
