import useTreasuries from "~/hooks/db/contribution/useTreasuries";
import ContributionManagerComponent from "./roles/contribution-manager/ContributionManagerComponent";
import ManageTreasuryComponent from "./roles/contribution-manager/ManageTreasuryComponent";
import ManageEscrowComponent from "./roles/contribution-manager/ManageEscrowComponent";
import AppLayout from "~/components/layout/AppLayout";

export default function ContributionManagerPage({
  selectedTreasuryCode,
  selectedEscrowId,
}: {
  selectedTreasuryCode: string;
  selectedEscrowId?: string;
}) {
  const { treasuries } = useTreasuries();

  const currentTreasury = treasuries?.find(
    (t) => t.id === selectedTreasuryCode,
  );

  return (
    <AppLayout>
      <div className="w-5/6 mx-auto">
        {selectedEscrowId && (
          <ManageEscrowComponent escrowId={selectedEscrowId} treasuryNftPolicyId={currentTreasury?.treasuryNftPolicyId} />
        )}
        {!currentTreasury && !selectedEscrowId && (
          <ContributionManagerComponent />
        )}
      </div>
    </AppLayout>
  );
}

// Future features:
//
//{currentTreasury && (
//  <ManageTreasuryComponent treasuryInfo={currentTreasury} />
//)}
