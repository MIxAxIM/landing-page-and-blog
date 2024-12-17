import ManageEscrowComponent from "./roles/contribution-manager/ManageEscrowComponent";
import AppLayout from "~/components/layout/AppLayout";
import { useEscrow } from "~/hooks/db/contribution/useEscrow";

export default function TreasuryLandingPageComponent({
  treasuryNftPolicyId,
}: {
  treasuryNftPolicyId: string;
}) {

  const { treasuryEscrows } = useEscrow({ treasuryNftPolicyId });

  if (!treasuryEscrows?.escrows || treasuryEscrows?.escrows.length === 0 || !treasuryEscrows?.escrows[0]) return

  return (
    <AppLayout>
      <div className="mx-auto w-5/6 ">
        <ManageEscrowComponent escrowId={treasuryEscrows.escrows[0].id} treasuryNftPolicyId={treasuryNftPolicyId} />
      </div>
    </AppLayout>
  );
}

