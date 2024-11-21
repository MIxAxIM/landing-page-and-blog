import { api } from "~/utils/api";
import { useToast } from "~/components/ui/use-toast";

export const useUserOrganizations = () => {
  const { data: organizations, isLoading } = api.organization.getUserOrganizations.useQuery();
  const { toast } = useToast();
  const utils = api.useUtils();

  const createOrganization = api.organization.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Organization created successfully",
      });
      void utils.organization.getUserOrganizations.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const leaveOrganization = api.organizationMember.leaveOrganization.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Left organization successfully",
      });
      void utils.organization.getUserOrganizations.invalidate();
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
    organizations,
    isLoading,
    createOrganization,
    leaveOrganization,
  };
};
