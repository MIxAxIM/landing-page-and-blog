import { useSession } from "next-auth/react";
import Loading from "~/components/common/loading";
import ContactSales from "~/ui/studio/ContactSales";
import Metatags from "~/components/common/metatags";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import { useRoles } from "~/hooks/app/useRoles";
import { useEffect } from "react";

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
      <Metatags title="Studio" />
      {status === "loading" && (
        <div className="mx-auto mt-32 min-h-[50vh] max-w-7xl px-6 sm:mt-56 lg:px-8">
          <Loading />
        </div>
      )}
      <h1>Your Projects</h1>
      {sessionData && !sessionData.user.creatorId && <ContactSales />}
    </DesktopOnlyLayout>
  );
}
