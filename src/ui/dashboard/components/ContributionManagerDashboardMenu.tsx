import { type Treasury } from "~/types/db";
import SelectTreasuryToManage from "~/ui/contribution/selection/SelectTreasuryToManage";

export default function ContributionManagerDashboardMenu({
  treasuryInfos,
}: {
  treasuryInfos: Treasury[];
}) {
  return (
    <div className="grid min-h-28 w-full grid-cols-6 items-center gap-5 bg-primary text-primary-foreground">
      <div className="col-span-2 col-start-2 text-center">
        <SelectTreasuryToManage treasuryInfos={treasuryInfos} />
      </div>
      <div className="col-span-2 col-start-4 text-center">Manage Projects</div>
      <div className="col-start-6 text-center">Notes</div>
    </div>
  );
}
