import { api } from "~/utils/api";
import { useToast } from "~/components/ui/use-toast";

export const useUserOrganizations = () => {
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

  // TODO: Implement invite member

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
    createOrganization,
    leaveOrganization,
  };
};
