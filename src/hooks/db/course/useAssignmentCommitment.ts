import { toast } from "react-hot-toast";
import { api } from "~/utils/api";
import { type AssignmentPrivateStatus, type AssignmentNetworkStatus } from "@prisma/client";
import { AssignmentCommitment } from "~/types/db";

type CreateAssignmentCommitmentInput = {
  assignmentId: string;
  learnerId: string;
  privateStatus?: AssignmentPrivateStatus;
  networkStatus?: AssignmentNetworkStatus;
  privateEvidence?: Record<string, unknown>;
  networkEvidence?: Record<string, unknown>;
  networkEvidenceHash?: string;
}

type UpdatePrivateEvidenceInput = {
  id: string;
  privateEvidence: Record<string, unknown>;
  privateStatus?: AssignmentPrivateStatus;
}
type UpdatePrivateStatusInput = {
  id: string;
  privateStatus: AssignmentPrivateStatus;
}

type UpdateNetworkEvidenceInput = {
  id: string;
  networkEvidence: Record<string, unknown>;
  networkEvidenceHash: string;
}
type UpdateNetworkStatusInput = {
  id: string;
  networkStatus: AssignmentNetworkStatus;
}


interface UseAssignmentCommitmentReturn {
  assignmentCommitment: AssignmentCommitment | null | undefined;
  assignmentCommitments: AssignmentCommitment[] | undefined;
  assignmentCommitmentsByCourse: AssignmentCommitment[] | undefined;
  assignmentCommitmentsByCourseModule: AssignmentCommitment[] | undefined;
  createAssignmentCommitment: (data: CreateAssignmentCommitmentInput) => void;
  updatePrivateEvidence: (data: UpdatePrivateEvidenceInput) => void;
  updatePrivateStatus: (data: UpdatePrivateStatusInput) => void;
  updateNetworkEvidence: (data: UpdateNetworkEvidenceInput) => void;
  updateNetworkStatus: (data: UpdateNetworkStatusInput) => void;
  deleteAssignmentCommitment: (id: string) => void;
  isLoadingAssignmentCommitment: boolean;
  isLoadingCommitments: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  toggleFavorite: (data: { id: string, favorite: boolean }) => void;
  toggleArchived: (data: { id: string, archived: boolean }) => void;
  error: any;
}


export function useAssignmentCommitment({
  id,
  assignmentId,
  learnerId,
  courseCode,
  moduleCode,
}: {
  id?: string;
  assignmentId?: string;
  learnerId?: string;
  courseCode?: string;
  moduleCode?: string;
}): UseAssignmentCommitmentReturn {
  const ctx = api.useUtils();

  // Queries
  const {
    data: assignmentCommitment,
    isLoading: isLoadingAssignmentCommitment,
    error,
  } = api.assignmentCommitment.getAssignmentCommitmentById.useQuery(
    id ?? "",
    { enabled: !!id }
  );

  const {
    data: assignmentCommitments,
    isLoading: isLoadingCommitments
  } = api.assignmentCommitment.getAssignmentCommitments.useQuery(
    {
      assignmentId,
      learnerId,
    },
    { enabled: !!assignmentId || !!learnerId }
  );

  const {
    data: assignmentCommitmentsByCourse,
    isLoading: isLoadingCommitmentsByCourse
  } = api.assignmentCommitment.getAssignmentCommitmentsByCourse.useQuery(
    {
      courseCode: courseCode ?? "",
      learnerId,
    },
    { enabled: !!courseCode }
  );

  const {
    data: assignmentCommitmentsByCourseModule,
    isLoading: isLoadingCommitmentsByCourseModule
  } = api.assignmentCommitment.getAssignmentCommitmentsByCourseModule.useQuery(
    {
      courseCode: courseCode ?? "",
      moduleCode: moduleCode ?? "",
    },
    { enabled: !!courseCode && !!moduleCode }
  );
  // Helper function to invalidate and refetch queries
  const refreshQueries = async () => {
    await Promise.all([
      ctx.assignmentCommitment.getAssignmentCommitmentById.invalidate(id),
      ctx.assignmentCommitment.getAssignmentCommitments.invalidate(),
    ]);
  };

  // Create mutation
  const createMutation = api.assignmentCommitment.createAssignmentCommitment.useMutation({
    onSuccess: async () => {
      toast.success("Assignment commitment created successfully");
      await refreshQueries();
    },
    onError: (error) => {
      if (!!error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create assignment commitment");
      }
    },
  });

  // Update private evidence mutation
  const updatePrivateEvidenceMutation = api.assignmentCommitment.updatePrivateEvidence.useMutation({
    onSuccess: async () => {
      toast.success("Evidence updated successfully");
      await refreshQueries();
    },
    onError: (error) => {
      if (!!error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update evidence");
      }
    },
  });

  // Update network evidence mutation
  const updateNetworkEvidenceMutation = api.assignmentCommitment.updateNetworkEvidence.useMutation({
    onSuccess: async () => {
      toast.success("Network evidence updated successfully");
      await refreshQueries();
    },
    onError: (error) => {
      if (!!error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update network evidence");
      }
    },
  });

  // Update network status mutation
  const updateNetworkStatusMutation = api.assignmentCommitment.updateNetworkStatus.useMutation({
    onSuccess: async () => {
      toast.success("Network status updated successfully");
      await refreshQueries();
    },
    onError: (error) => {
      if (!!error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update network status");
      }
    },
  });

  // Update private status mutation
  const updatePrivateStatusMutation = api.assignmentCommitment.updatePrivateStatus.useMutation({
    onSuccess: async () => {
      toast.success("Status updated successfully");
      await refreshQueries();
    },
    onError: (error) => {
      if (!!error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update status");
      }
    },
  });

  // Toggle favorite mutation
  const toggleFavoriteMutation = api.assignmentCommitment.toggleFavorite.useMutation({
    onSuccess: async () => {
      await refreshQueries();
    },
    onError: (error) => {
      if (!!error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to toggle favorite");
      }
    },
  });

  // Toggle archived mutation
  const toggleArchivedMutation = api.assignmentCommitment.toggleArchived.useMutation({
    onSuccess: async () => {
      await refreshQueries();
    },
    onError: (error) => {
      if (!!error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to toggle archived");
      }
    },
  });

  // Delete mutation
  const deleteMutation = api.assignmentCommitment.deleteAssignmentCommitment.useMutation({
    onSuccess: async () => {
      toast.success("Assignment commitment deleted successfully");
      await refreshQueries();
    },
    onError: (error) => {
      if (!!error.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete assignment commitment");
      }
    },
  });

  return {
    // Queries
    assignmentCommitment,
    assignmentCommitments,
    assignmentCommitmentsByCourse,
    assignmentCommitmentsByCourseModule,
    isLoadingAssignmentCommitment,
    isLoadingCommitments,
    error,

    // Mutation states
    isCreating: createMutation.isLoading,
    isUpdating:
      updatePrivateEvidenceMutation.isLoading ||
      updateNetworkEvidenceMutation.isLoading ||
      updateNetworkStatusMutation.isLoading ||
      updatePrivateStatusMutation.isLoading,
    isDeleting: deleteMutation.isLoading,

    // Mutation functions
    createAssignmentCommitment: createMutation.mutate,
    updatePrivateEvidence: updatePrivateEvidenceMutation.mutate,
    updateNetworkEvidence: updateNetworkEvidenceMutation.mutate,
    updateNetworkStatus: updateNetworkStatusMutation.mutate,
    updatePrivateStatus: updatePrivateStatusMutation.mutate,
    toggleFavorite: toggleFavoriteMutation.mutate,
    toggleArchived: toggleArchivedMutation.mutate,
    deleteAssignmentCommitment: deleteMutation.mutate,
  };
}
