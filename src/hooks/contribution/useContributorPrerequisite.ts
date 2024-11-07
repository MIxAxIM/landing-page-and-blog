import { api } from "~/utils/api";
import { type ContributorPrerequisite } from "~/types/db";
import toast from "react-hot-toast";

type CreatePrerequisiteInput = {
  contributorPolicyId: string;
  title?: string;
  prerequisites: string[];
};

type UpdatePrerequisiteInput = {
  contributorPolicyId: string;
  title?: string;
  prerequisites?: string[];
};

interface UseContributorPrerequisiteReturn {
  prerequisite: ContributorPrerequisite | null | undefined;
  prerequisites: ContributorPrerequisite[];
  isLoading: boolean;
  createPrerequisite: (data: CreatePrerequisiteInput) => void;
  updatePrerequisite: (data: UpdatePrerequisiteInput) => void;
  deletePrerequisite: (id: string) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function useContributorPrerequisite(
  id?: string,
): UseContributorPrerequisiteReturn {
  const ctx = api.useUtils();

  // Queries
  const { data: prerequisite } =
    api.contributorPrerequisite.getPrerequisiteById.useQuery(id ?? "", {
      enabled: !!id,
    });

  const { data: prerequisites = [], isLoading } =
    api.contributorPrerequisite.getPrerequisites.useQuery();

  // Helper function to invalidate and refetch queries
  const refreshQueries = async () => {
    await Promise.all([
      ctx.contributorPrerequisite.getPrerequisites.invalidate(),
      id
        ? ctx.contributorPrerequisite.getPrerequisiteById.invalidate(id)
        : Promise.resolve(),
      ctx.escrow.getEscrows.invalidate(),
    ]);
  };

  // Mutations
  const createPrerequisiteMutation =
    api.contributorPrerequisite.createPrerequisite.useMutation({
      onSuccess: async () => {
        toast.success("Prerequisite created successfully");
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
          toast.error(error.message || "Failed to create prerequisite");
        }
      },
    });

  const updatePrerequisiteMutation =
    api.contributorPrerequisite.updatePrerequisite.useMutation({
      onSuccess: async () => {
        toast.success("Prerequisite updated successfully");
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
          toast.error(error.message || "Failed to update prerequisite");
        }
      },
    });

  const deletePrerequisiteMutation =
    api.contributorPrerequisite.deletePrerequisite.useMutation({
      onSuccess: async () => {
        toast.success("Prerequisite deleted successfully");
        await refreshQueries();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to delete prerequisite");
      },
    });

  return {
    prerequisite,
    prerequisites,
    isLoading,
    createPrerequisite: createPrerequisiteMutation.mutate,
    updatePrerequisite: updatePrerequisiteMutation.mutate,
    deletePrerequisite: deletePrerequisiteMutation.mutate,
    isCreating: createPrerequisiteMutation.isLoading,
    isUpdating: updatePrerequisiteMutation.isLoading,
    isDeleting: deletePrerequisiteMutation.isLoading,
  };
}
