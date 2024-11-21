import { api } from "~/utils/api";
import { useToast } from "~/components/ui/use-toast";

// Core organization data hook
export const useOrganization = (id: string) => {
  const { data: organization, isLoading } = api.organization.getById.useQuery(id);
  const { toast } = useToast();
  const utils = api.useUtils();

  const updateOrganization = api.organization.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Organization updated successfully",
      });
      void utils.organization.getById.invalidate(id);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteOrganization = api.organization.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Organization deleted successfully",
      });
      void utils.organization.getAll.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    organization,
    isLoading,
    updateOrganization,
    deleteOrganization,
  };
};
