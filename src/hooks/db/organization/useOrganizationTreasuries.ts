import { useCallback } from "react";
import { api } from "~/utils/api";
import { useToast } from "~/components/ui/use-toast";

export const useOrganizationTreasuries = (organizationId: string) => {
  const { data: treasuries, isLoading } = api.organizationTreasury.getTreasuries.useQuery(
    organizationId
  );
  const { toast } = useToast();
  const utils = api.useUtils();

  const addTreasury = api.organizationTreasury.addTreasury.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Treasury added successfully",
      });
      void utils.organizationTreasury.getTreasuries.invalidate(organizationId);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeTreasury = api.organizationTreasury.removeTreasury.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Treasury removed successfully",
      });
      void utils.organizationTreasury.getTreasuries.invalidate(organizationId);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getTreasurySummary = useCallback(
    (treasuryNftPolicyId: string) => {
      return api.organizationTreasury.getTreasurySummary.useQuery({
        organizationId,
        treasuryNftPolicyId,
      });
    },
    [organizationId]
  );

  return {
    treasuries,
    isLoading,
    addTreasury,
    removeTreasury,
    getTreasurySummary,
  };
};
