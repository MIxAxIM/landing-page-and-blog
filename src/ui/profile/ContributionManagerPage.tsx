import useTreasuries from "~/hooks/contribution/useTreasuries";
import ContributionManagerDashboardMenu from "./components/dashboard-menus/ContributionManagerDashboardMenu";
import ProfileLayout from "./layout/ProfileLayout";
import ContributionManagerComponent from "./roles/contribution-manager/ContributionManagerComponent";
import ManageTreasuryComponent from "./roles/contribution-manager/ManageTreasuryComponent";
import ManageEscrowComponent from "./roles/contribution-manager/ManageEscrowComponent";

export default function ContributionManagerPage({
  selectedTreasuryCode,
  selectedEscrowCode,
}: {
  selectedTreasuryCode?: string;
  selectedEscrowCode?: string;
}) {
  const { treasuries } = useTreasuries();

  const currentTreasury = treasuries?.find(
    (t) => t.treasuryNftPolicyId === selectedTreasuryCode,
  );

  return (
    <ProfileLayout>
      <ContributionManagerDashboardMenu treasuryInfos={treasuries ?? []} />
      {currentTreasury && (
        <ManageTreasuryComponent treasuryInfo={currentTreasury} />
      )}
      {selectedEscrowCode && (
        <ManageEscrowComponent escrowCode={selectedEscrowCode} />
      )}
      {!currentTreasury && !selectedEscrowCode && (
        <ContributionManagerComponent treasuryInfos={treasuries ?? []} />
      )}
    </ProfileLayout>
  );
}
