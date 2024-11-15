import { api } from "~/utils/api";

export function useSubscriptionAccess() {
  const ctx = api.useUtils();

  const checkFeatureAccess = (feature: "CREATE_COURSE" | "CREATE_TREASURY" | "PUBLISH_CONTENT" | "CUSTOM_DOMAIN") => {
    return api.billing.checkAccess.useQuery(
      { feature },
      {
        // Shorter stale time since these limits can change frequently
        staleTime: 1000 * 60 * 5, // 5 minutes
      }
    );
  };

  // Convenience methods for common checks
  const canCreateCourse = checkFeatureAccess("CREATE_COURSE");
  const canCreateTreasury = checkFeatureAccess("CREATE_TREASURY");
  const canPublishContent = checkFeatureAccess("PUBLISH_CONTENT");
  const canUseCustomDomain = checkFeatureAccess("CUSTOM_DOMAIN");

  return {
    checkFeatureAccess,
    canCreateCourse,
    canCreateTreasury,
    canPublishContent,
    canUseCustomDomain,
  };
}  
