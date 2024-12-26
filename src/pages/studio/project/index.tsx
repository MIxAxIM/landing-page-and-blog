import { useSession } from "next-auth/react";
import Loading from "~/components/common/loading";
import Metatags from "~/components/common/metatags";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import { useRoles } from "~/hooks/app/useRoles";
import { useEffect } from "react";
import AppLayout from "~/components/layout/AppLayout";
import ContributionManagerComponent from "~/ui/studio/project/ContributionManagerComponent";

export default function StudioProjectLandingPage() {
  const { data: sessionData, status } = useSession();
  const { enableTreasuryOwner, enableContributionManager } = useRoles()

  useEffect(() => {
    if (sessionData?.user && !sessionData.user.treasuryOwnerId) {
      void enableTreasuryOwner();
    }
    if (sessionData?.user && !sessionData.user.contributionManagerId) {
      void enableContributionManager();
    }
  }, [sessionData, enableTreasuryOwner, enableContributionManager]);

  return (
    <DesktopOnlyLayout>
      <Metatags title="Project Studio" />
      <AppLayout>
        <div className="mx-auto w-3/4 my-24">
          {status === "loading" && (
            <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
              <Loading />
            </div>
          )}
          <div className="text-center text-4xl">Andamio Studio</div>
          <ContributionManagerComponent />
        </div>
      </AppLayout>
    </DesktopOnlyLayout>
  );
}
