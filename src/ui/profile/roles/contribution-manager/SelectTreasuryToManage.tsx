import { useRouter } from "next/router";
import DashboardSelectMenu from "~/ui/profile/components/DashboardSelectMenu";

export default function SelectTreasuryToManage({
  treasuryInfos,
}: {
  treasuryInfos: { treasuryCode: string; title: string }[];
}) {
  const router = useRouter();
  const currentTreasuryCode = router.query.treasurycode as string;

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
