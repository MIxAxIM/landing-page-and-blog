import ContributionManagerDashboardMenu from "./components/dashboard-menus/ContributionManagerDashboardMenu";
import ProfileLayout from "./layout/ProfileLayout";
import ContributionManagerComponent from "./roles/contribution-manager/ContributionManagerComponent";
import ManageTreasuryComponent from "./roles/contribution-manager/ManageTreasuryComponent";

const tInfos = [
  { treasuryCode: "test-treasury-001", title: "First Treasury" },
  { treasuryCode: "test-treasury-002", title: "Second Treasury" },
  { treasuryCode: "test-treasury-003", title: "A different treasury" },
];

export default function ContributionManagerPage({
  selectedTreasuryCode,
}: {
  selectedTreasuryCode?: string;
}) {
  const currentTreasury = tInfos.find(
    (t) => t.treasuryCode === selectedTreasuryCode,
  );

  return (
    <ProfileLayout>
      <ContributionManagerDashboardMenu treasuryInfos={tInfos} />
      {currentTreasury ? (
        <ManageTreasuryComponent treasuryInfo={currentTreasury} />
      ) : (
        <ContributionManagerComponent treasuryInfos={tInfos} />
      )}
    </ProfileLayout>
  );
}
