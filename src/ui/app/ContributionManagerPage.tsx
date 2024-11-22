import useTreasuries from "~/hooks/contribution/useTreasuries";
import ContributionManagerComponent from "./roles/contribution-manager/ContributionManagerComponent";
import ManageTreasuryComponent from "./roles/contribution-manager/ManageTreasuryComponent";
import ManageEscrowComponent from "./roles/contribution-manager/ManageEscrowComponent";
import AppLayout from "./layout/AppLayout";

export default function ContributionManagerPage({
  selectedTreasuryCode,
  selectedEscrowId,
}: {
  selectedTreasuryCode?: string;
  selectedEscrowId?: string;
}) {
  const { treasuries } = useTreasuries();

  const currentTreasury = treasuries?.find(
    (t) => t.id === selectedTreasuryCode,
  );

  return (
    <AppLayout>
      {currentTreasury && (
        <ManageTreasuryComponent treasuryInfo={currentTreasury} />
      )}
      {selectedEscrowId && (
        <ManageEscrowComponent escrowId={selectedEscrowId} />
      )}
      {!currentTreasury && !selectedEscrowId && (
        <ContributionManagerComponent />
      )}
    </AppLayout>
  );
}
