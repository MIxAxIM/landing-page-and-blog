import AppLayout from "~/components/layout/AppLayout";
import ContributionManagerComponent from "./roles/contribution-manager/ContributionManagerComponent";
import { useSession } from "next-auth/react";
import PublicTreasuryListComponent from "../contribution/lists/PublicTreasuryListComponent";

export default function ProjectsPageComponent() {
  const { data: sessionData } = useSession()
  return (
    <AppLayout>
      <div className="mx-auto my-24 w-5/6 space-y-5">
        {sessionData?.user.contributionManagerId && (
          <ContributionManagerComponent />
        )}
        <PublicTreasuryListComponent />
      </div>
    </AppLayout>
  );
}
