import { useRouter } from "next/router";
import { type Treasury } from "~/types/db";
import DashboardSelectMenu from "~/ui/profile/components/DashboardSelectMenu";

export default function SelectTreasuryToManage({
  treasuryInfos,
}: {
  treasuryInfos: Treasury[];
}) {
  const router = useRouter();
  const currentTreasuryCode = router.query.treasurynftcs as string;

  if (!treasuryInfos) return;

  return (
    <DashboardSelectMenu
      title="Current Treasuries"
      dashboardRoute="dashboard/contribution-manager"
      currentItemCode={currentTreasuryCode}
      treasuryInfos={treasuryInfos}
      placeholder="Select a treasury"
    />
  );
}
