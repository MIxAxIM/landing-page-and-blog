import { api } from "~/utils/api";
import { useToast } from "~/components/ui/use-toast";

export const useOrganizationMembers = (organizationId: string) => {
  const { data: members, isLoading } = api.organizationMember.getMembers.useQuery(
    organizationId
  );
  const { toast } = useToast();
  const utils = api.useUtils();

  const addMember = api.organizationMember.addMember.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Member added successfully",
      });
      void utils.organizationMember.getMembers.invalidate(organizationId);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMemberRole = api.organizationMember.updateMemberRole.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Member role updated successfully",
      });
      void utils.organizationMember.getMembers.invalidate(organizationId);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeMember = api.organizationMember.removeMember.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Member removed successfully",
      });
      void utils.organizationMember.getMembers.invalidate(organizationId);
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
    members,
    isLoading,
    addMember,
    updateMemberRole,
    removeMember,
  };
};
