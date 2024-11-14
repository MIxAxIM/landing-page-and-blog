import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";


export function useRoles() {
  const ctx = api.useUtils();
  const { data: sessionData, update: updateSession } = useSession();

  // Queries
  const getCreator = (userId: string) => {
    return api.creator.getCreatorByUser.useQuery(
      { userId },
      { enabled: !!userId }
    );
  };

  const getLearner = (userId: string) => {
    return api.learner.getLearnerByUser.useQuery(
      { userId },
      { enabled: !!userId }
    );
  };

  const getContributor = (userId: string) => {
    return api.contributor.getContributorByUser.useQuery(
      { userId },
      { enabled: !!userId }
    );
  };

  const getContributionManager = (userId: string) => {
    return api.contributionManager.getContributionManagerByUser.useQuery(
      { userId },
      { enabled: !!userId }
    );
  };

  const getTreasuryOwner = (userId: string) => {
    return api.treasuryOwner.getTreasuryOwnerByUser.useQuery(
      { userId },
      { enabled: !!userId }
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

    // Loading states
    isCreating: createCreator.isLoading || createLearner.isLoading,
  };
}
