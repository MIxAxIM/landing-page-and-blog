import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";


export function useRoles() {
  const ctx = api.useUtils();
  const { data: sessionData, update: updateSession } = useSession();

  // Queries
  const getCreator = () => {
    return api.creator.getCreatorByUser.useQuery(
      { userId: sessionData?.user.id ?? "" },
      { enabled: (!!sessionData?.user.id) }
    );
  };

  const getLearner = () => {
    return api.learner.getLearnerByUser.useQuery(
      { userId: sessionData?.user.id ?? "" },
      { enabled: (!!sessionData?.user.id) }
    );
  };

  const getContributor = () => {
    return api.contributor.getContributorByUser.useQuery(
      { userId: sessionData?.user.id ?? "" },
      { enabled: (!!sessionData?.user.id) }
    );
  };

  const getContributionManager = () => {
    return api.contributionManager.getContributionManagerByUser.useQuery(
      { userId: sessionData?.user.id ?? "" },
      { enabled: (!!sessionData?.user.id) }
    );
  };

  const getTreasuryOwner = () => {
    return api.treasuryOwner.getTreasuryOwnerByUser.useQuery(
      { userId: sessionData?.user.id ?? "" },
      { enabled: (!!sessionData?.user.id) }
    );
  };

  // Mutations
  const createCreator = api.creator.create.useMutation({
    onSuccess: () => {
      toast.success("Creator role added successfully!");
      void ctx.creator.getCreatorByUser.invalidate();
      void updateSession();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Cannot add creator role");
      } else {
        toast.error("Creator role already exists. Please try again.");
      }
    },
  });

  const createLearner = api.learner.create.useMutation({
    onSuccess: () => {
      toast.success("Learner role added successfully!");
      void ctx.learner.getLearnerByUser.invalidate();
      void updateSession();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Cannot add learner role");
      } else {
        toast.error("Learner role already exists. Please try again.");
      }
    },
  });

  const createContributor = api.contributor.create.useMutation({
    onSuccess: () => {
      toast.success("Contributor role added successfully!");
      void ctx.contributor.getContributorByUser.invalidate();
      void updateSession();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Cannot add contributor role");
      } else {
        toast.error("Contributor role already exists. Please try again.");
      }
    },
  });

  const createContributionManager = api.contributionManager.create.useMutation({
    onSuccess: () => {
      toast.success("Learner role added successfully!");
      void ctx.contributionManager.getContributionManagerByUser.invalidate();
      void updateSession();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Cannot add organizer role");
      } else {
        toast.error("Organizer role already exists. Please try again.");
      }
    },
  });

  const createTreasuryOwner = api.treasuryOwner.create.useMutation({
    onSuccess: () => {
      toast.success("Treasury owner role added successfully!");
      void ctx.treasuryOwner.getTreasuryOwnerByUser.invalidate();
      void updateSession();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Cannot add treasury owner role");
      } else {
        toast.error("Treasury owner role already exists. Please try again.");
      }
    },
  });

  // Helper functions
  const enableCreator = () => {
    if (!sessionData?.user.id) return;
    createCreator.mutate({ userId: sessionData.user.id });
  };

  const enableLearner = () => {
    if (!sessionData?.user.id) return;
    createLearner.mutate({ userId: sessionData.user.id });
  };

  const enableContributor = () => {
    if (!sessionData?.user.id) return;
    createContributor.mutate({ userId: sessionData.user.id });
  };

  const enableContributionManager = () => {
    if (!sessionData?.user.id) return;
    createContributionManager.mutate({ userId: sessionData.user.id });
  };

  const enableTreasuryOwner = () => {
    if (!sessionData?.user.id) return;
    createTreasuryOwner.mutate({ userId: sessionData.user.id });
  };

  // Update Onboarding Statuses
  const updateCreatorOnboarding = api.creator.updateOnboardingStatus.useMutation({
    onSuccess: () => {
      toast.success("Onboarding status updated successfully!");
      void ctx.creator.getCreatorByUser.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Failed to update onboarding status");
      } else {
        toast.error("An error occurred while updating onboarding status");
      }
    },
  });

  const updateLearnerOnboarding = api.learner.updateOnboardingStatus.useMutation({
    onSuccess: () => {
      toast.success("Onboarding status updated successfully!");
      void ctx.learner.getLearnerByUser.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Failed to update onboarding status");
      } else {
        toast.error("An error occurred while updating onboarding status");
      }
    },
  });

  const updateContributorOnboarding = api.contributor.updateOnboardingStatus.useMutation({
    onSuccess: () => {
      toast.success("Onboarding status updated successfully!");
      void ctx.contributor.getContributorByUser.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Failed to update onboarding status");
      } else {
        toast.error("An error occurred while updating onboarding status");
      }
    },
  });

  const updateContributionManagerOnboarding = api.contributionManager.updateOnboardingStatus.useMutation({
    onSuccess: () => {
      toast.success("Onboarding status updated successfully!");
      void ctx.contributionManager.getContributionManagerByUser.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Failed to update onboarding status");
      } else {
        toast.error("An error occurred while updating onboarding status");
      }
    },
  });

  const updateTreasuryOwnerOnboarding = api.treasuryOwner.updateOnboardingStatus.useMutation({
    onSuccess: () => {
      toast.success("Onboarding status updated successfully!");
      void ctx.treasuryOwner.getTreasuryOwnerByUser.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors;
      if (errorMessage) {
        toast.error("Failed to update onboarding status");
      } else {
        toast.error("An error occurred while updating onboarding status");
      }
    },
  });

  // Add a helper function that makes it easy to update onboarding status
  const updateCreatorOnboardingStatus = (
    id: string,
    status: "NOT_STARTED" | "SKIPPED" | "PARTIAL" | "COMPLETE",
    completedAt?: Date
  ) => {
    updateCreatorOnboarding.mutate({
      creatorId: id,
      onboardingStatus: status,
      onboardingCompletedAt: completedAt
    });
  };

  const updateLearnerOnboardingStatus = (
    id: string,
    status: "NOT_STARTED" | "SKIPPED" | "PARTIAL" | "COMPLETE",
    completedAt?: Date
  ) => {
    updateLearnerOnboarding.mutate({
      learnerId: id,
      onboardingStatus: status,
      onboardingCompletedAt: completedAt
    });
  };

  const updateContributorOnboardingStatus = (
    id: string,
    status: "NOT_STARTED" | "SKIPPED" | "PARTIAL" | "COMPLETE",
    completedAt?: Date
  ) => {
    updateContributorOnboarding.mutate({
      contributorId: id,
      onboardingStatus: status,
      onboardingCompletedAt: completedAt
    });
  };

  const updateContributionManagerOnboardingStatus = (
    id: string,
    status: "NOT_STARTED" | "SKIPPED" | "PARTIAL" | "COMPLETE",
    completedAt?: Date
  ) => {
    updateContributionManagerOnboarding.mutate({
      contributionManagerId: id,
      onboardingStatus: status,
      onboardingCompletedAt: completedAt
    });
  };

  const updateTreasuryManagerOnboardingStatus = (
    id: string,
    status: "NOT_STARTED" | "SKIPPED" | "PARTIAL" | "COMPLETE",
    completedAt?: Date
  ) => {
    updateTreasuryOwnerOnboarding.mutate({
      treasuryOwnerId: id,
      onboardingStatus: status,
      onboardingCompletedAt: completedAt
    });
  };

  return {
    // Session data
    sessionData,

    // Queries
    getCreator,
    getLearner,
    getContributor,
    getContributionManager,
    getTreasuryOwner,

    // Helper functions
    enableCreator,
    enableLearner,
    enableContributor,
    enableContributionManager,
    enableTreasuryOwner,

    // Update Onboarding Status
    updateCreatorOnboardingStatus,
    updateLearnerOnboardingStatus,
    updateContributorOnboardingStatus,
    updateContributionManagerOnboardingStatus,
    updateTreasuryManagerOnboardingStatus,

    // Loading states
    isCreating: createCreator.isLoading || createLearner.isLoading,
  };
}
