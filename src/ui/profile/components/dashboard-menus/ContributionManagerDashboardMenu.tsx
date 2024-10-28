import Link from "next/link";
import SelectTreasuryToManage from "../../roles/contribution-manager/SelectTreasuryToManage";

export default function ContributionManagerDashboardMenu({
  treasuryInfos,
}: {
  treasuryInfos: { treasuryCode: string; title: string }[];
}) {
  return (
    <div className="grid min-h-28 w-full grid-cols-6 items-center gap-5 bg-primary text-primary-foreground">
      <div className="col-start-1 text-center">
        <Link href="/dashboard/contribution-manager">
          <div className={`cursor-pointer p-2 font-semibold`}>
            Contribution Manager Dashboard Home
          </div>
        </Link>
      </div>
      <div className="col-span-2 col-start-2 text-center">
        <SelectTreasuryToManage treasuryInfos={treasuryInfos} />
      </div>
      <div className="col-span-2 col-start-4 text-center">Manage Projects</div>
      <div className="col-start-6 text-center">Notes</div>
    </div>
  );
}
