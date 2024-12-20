import AppLayout from "~/components/layout/AppLayout";
import { useSession } from "next-auth/react";
import PublicTreasuryListComponent from "../contribution/lists/PublicTreasuryListComponent";
import { useRoles } from "~/hooks/app/useRoles";
import { useEffect } from "react";

export default function PublicProjectsPageComponent() {
  const { data: sessionData } = useSession()
  const { enableContributor } = useRoles()

  useEffect(() => {
    if (sessionData?.user && !sessionData.user.contributorId) {
      void enableContributor();
    }
  }, [sessionData, enableContributor]);

  return (
    <AppLayout>
      <div className="mx-auto my-24 w-5/6 space-y-5">
        <PublicTreasuryListComponent />
      </div>
    </AppLayout>
  );
}
