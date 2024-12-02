import { api } from "~/utils/api";
import { type ContributorPrerequisite } from "~/types/db";
import toast from "react-hot-toast";

type CourseRequirementInput = {
  courseCode: string;
  requiredModules: string[];
};

type CreatePrerequisiteInput = {
  title?: string;
  courseRequirements: CourseRequirementInput[];
};

type UpdatePrerequisiteInput = {
  id: string;
  contributorPolicyId?: string;
  title?: string;
  courseRequirements?: (CourseRequirementInput & { id?: string })[];
};

interface UseContributorPrerequisiteReturn {
  prerequisite: ContributorPrerequisite | null | undefined;
  prerequisites: ContributorPrerequisite[];
  prerequisitesByCourse: ContributorPrerequisite[];
  prerequisiteByPolicyId: ContributorPrerequisite | null | undefined;
  isLoading: boolean;
  createPrerequisite: (data: CreatePrerequisiteInput) => void;
  updatePrerequisite: (data: UpdatePrerequisiteInput) => void;
  deletePrerequisite: (id: string) => void;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

export function useContributorPrerequisite(
  {
    id,
    courseCode,
    contributorPolicyId,
  }: {
    id?: string,
    courseCode?: string,
    contributorPolicyId?: string,
  }): UseContributorPrerequisiteReturn {
  const ctx = api.useUtils();

  // Queries
  const { data: prerequisite } =
    api.contributorPrerequisite.getPrerequisiteById.useQuery(id ?? "", {
      enabled: !!id,
      select: (data) =>
        data &&
        ({
          ...data,
          courseRequirements: data.courseRequirements.map((req) => ({
            ...req,
            course: req.course && {
              id: req.course.id,
              courseCode: req.course.courseCode,
              title: req.course.title,
              courseCreatorNFTPolicyID: req.course.onchainInstance[0]?.CourseCreatorNFTPolicyID ?? "",
            },
          })),
        } as ContributorPrerequisite),
    });


  const { data: prerequisiteByPolicyId } =
    api.contributorPrerequisite.getPrerequisiteByContributorPolicyId.useQuery(contributorPolicyId ?? "", {
      enabled: !!contributorPolicyId,
      select: (data) =>
        data &&
        ({
          ...data,
          courseRequirements: data.courseRequirements.map((req) => ({
            ...req,
            course: req.course && {
              id: req.course.id,
              courseCode: req.course.courseCode,
              title: req.course.title,
              courseCreatorNFTPolicyID: req.course.onchainInstance[0]?.CourseCreatorNFTPolicyID ?? "",
            },
          })),
        } as ContributorPrerequisite),
    });

  const { data: prerequisites = [], isLoading } =
    api.contributorPrerequisite.getPrerequisites.useQuery(undefined, {
      select: (data) =>
        data.map((item) => ({
          ...item,
          courseRequirements: item.courseRequirements.map((req) => ({
            ...req,
            course: req.course && {
              id: req.course.id,
              courseCode: req.course.courseCode,
              title: req.course.title,
              courseCreatorNFTPolicyID: req.course.onchainInstance[0]?.CourseCreatorNFTPolicyID ?? "",
            },
          })),
        })) as ContributorPrerequisite[],
    });

  const { data: prerequisitesByCourse = [] } =
    api.contributorPrerequisite.getPrerequisitesByCourse.useQuery(
      courseCode ?? "",
      {
        enabled: !!courseCode,
        select: (data) =>
          data.map((item) => ({
            ...item,
            courseRequirements: item.courseRequirements.map((req) => ({
              ...req,
              course: req.course && {
                id: req.course.id,
                courseCode: req.course.courseCode,
                title: req.course.title,
                courseCreatorNFTPolicyID: req.course.onchainInstance[0]?.CourseCreatorNFTPolicyID ?? "",
              },
            })),
          })) as ContributorPrerequisite[],
      },
    );

  // Helper function to invalidate and refetch queries
  const refreshQueries = async () => {
    await Promise.all([
      ctx.contributorPrerequisite.getPrerequisites.invalidate(),
      id
        ? ctx.contributorPrerequisite.getPrerequisiteById.invalidate(id)
        : Promise.resolve(),
      courseCode
        ? ctx.contributorPrerequisite.getPrerequisitesByCourse.invalidate(
          courseCode,
        )
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
    prerequisitesByCourse,
    prerequisiteByPolicyId,
    isLoading,
    createPrerequisite: createPrerequisiteMutation.mutate,
    updatePrerequisite: updatePrerequisiteMutation.mutate,
    deletePrerequisite: deletePrerequisiteMutation.mutate,
    isCreating: createPrerequisiteMutation.isLoading,
    isUpdating: updatePrerequisiteMutation.isLoading,
    isDeleting: deletePrerequisiteMutation.isLoading,
  };
}
