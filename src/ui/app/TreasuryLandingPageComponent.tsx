import ContributionManagerComponent from "./roles/contribution-manager/ContributionManagerComponent";
import ManageEscrowComponent from "./roles/contribution-manager/ManageEscrowComponent";
import AppLayout from "~/components/layout/AppLayout";
import { useEscrow } from "~/hooks/db/contribution/useEscrow";

export default function TreasuryLandingPageComponent({
  treasuryNftPolicyId,
}: {
  treasuryNftPolicyId: string;
}) {

  const { treasuryEscrows } = useEscrow({ treasuryNftPolicyId });

  return (
    <AppLayout>
      <div className="w-5/6 mx-auto">
        {!!treasuryEscrows && !!treasuryEscrows.escrows[0]?.id ? (
          <ManageEscrowComponent escrowId={treasuryEscrows.escrows[0].id} treasuryNftPolicyId={treasuryNftPolicyId} />
        ) : (
          <ContributionManagerComponent />
        )}
      </div>
    </AppLayout>
  );
}

