import { api } from "~/utils/api";
import { type Treasury, CoursePublic, OrganizationRelationship } from "~/types/db";
import { useSession } from "next-auth/react";

interface UserRelationships {
  treasuries: {
    asOwner: Treasury[];
    asManager: Treasury[];
    asContributor: Treasury[];
  };
  courses: {
    asCreator: CoursePublic[];
    asContributor: CoursePublic[];
    //asLearner: CoursePublic[];
  };
  organizations: {
    asOwner: OrganizationRelationship[],
    asAdmin: OrganizationRelationship[],
    asMember: OrganizationRelationship[],
    asGuest: OrganizationRelationship[],
  }
  isLoading: boolean;
}

export default function useUserRelationships(): UserRelationships {
  const { data: sessionData } = useSession()

  // Treasury queries
  const { data: ownerTreasuries = [], isLoading: isLoadingOwnerTreasuries } =
    api.treasuryOwner.getTreasuryOwnerTreasuries.useQuery(
      { treasuryOwnerId: sessionData?.user.treasuryOwnerId ?? "" },
      { enabled: !!sessionData?.user.treasuryOwnerId }
    );

  const { data: managerTreasuries = [], isLoading: isLoadingManagerTreasuries } =
    api.contributionManager.getContributionManagerTreasuries.useQuery(
      { contributionManagerId: sessionData?.user.contributionManagerId ?? "" },
      { enabled: !!sessionData?.user.contributionManagerId }
    );

  const { data: contributorTreasuries = [], isLoading: isLoadingContributorTreasuries } =
    api.contributor.getContributorTreasuries.useQuery(
      { contributorId: sessionData?.user.contributorId ?? "" },
      { enabled: !!sessionData?.user.contributorId }
    );

  // Course queries
  const { data: createdCourses = [], isLoading: isLoadingCreatedCourses } =
    api.creator.getCreatedCourses.useQuery(
      { creatorId: sessionData?.user.creatorId ?? "" },
      { enabled: !!sessionData?.user.creatorId }
    );

  const { data: contributedCourses = [], isLoading: isLoadingContributedCourses } =
    api.creator.getContributedCourses.useQuery(
      { creatorId: sessionData?.user.creatorId ?? "" },
      { enabled: !!sessionData?.user.creatorId }
    );

  // TODO: Add Learner dashboard features - start here
  //const { data: savedCourses = [], isLoading: isLoadingSavedCourses } =
  //  api.learner.getSavedCoursesByLearner.useQuery(
  //    { learnerId: userId },
  //    { enabled: !!userId }
  //  );

  // Organization queries with role filtering
  const { data: organizations = [], isLoading: isLoadingOrganizations } =
    api.organization.getUserOrganizations.useQuery(
      { id: sessionData?.user.id ?? "" },
      { enabled: !!sessionData?.user.id }
    );

  const organizationsByRole = {
    asOwner: organizations.filter(org => org.role === 'OWNER') ?? [],
    asAdmin: organizations.filter(org => org.role === 'ADMIN') ?? [],
    asMember: organizations.filter(org => org.role === 'MEMBER') ?? [],
    asGuest: organizations.filter(org => org.role === 'GUEST') ?? []
  };

  return {
    treasuries: {
      asOwner: ownerTreasuries,
      asManager: managerTreasuries,
      asContributor: contributorTreasuries
    },
    courses: {
      asCreator: createdCourses,
      asContributor: contributedCourses,
      //asLearner: savedCourses
    },
    organizations: organizationsByRole,
    isLoading:
      isLoadingOwnerTreasuries ||
      isLoadingManagerTreasuries ||
      isLoadingContributorTreasuries ||
      isLoadingCreatedCourses ||
      isLoadingContributedCourses ||
      //isLoadingSavedCourses ||
      isLoadingOrganizations
  };
}
