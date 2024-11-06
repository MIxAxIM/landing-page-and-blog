import PlaceholderComponent from "~/ui/prototype/PlaceholderComponent";
import SelectTreasuryToManage from "./SelectTreasuryToManage";
import TreasuryListComponent from "./TreasuryListComponent";
import { type Treasury } from "~/types/db";
import DialogTreasury from "~/ui/profile/components/dialogs/DialogTreasury";
import DialogEscrow from "../../components/dialogs/DialogEscrow";
import DialogTask from "../../components/dialogs/DialogTask";

export default function ContributionManagerComponent({
  treasuryInfos,
}: {
  treasuryInfos: Treasury[];
}) {
  return (
    <div>
      <div className="mx-auto mt-12 grid w-11/12 grid-cols-3 gap-5">
        <div className="col-span-3">
          <h2 className="text-4xl">Contribution Manager Dashboard Home</h2>
        </div>
        <div className="col-span-3">
          <PlaceholderComponent
            name="Table: Overview of Current Treasuries"
            userStory="CONTRIBUTION-001"
          >
            <>
              <TreasuryListComponent />
            </>
          </PlaceholderComponent>
        </div>
        <div className="col-span-1">
          <PlaceholderComponent
            name="Quick Actions"
            userStory="CONTRIBUTION-002"
          >
            <>
              <p>View tasks by selecting a Treasury</p>
              <div className="grid grid-cols-1 gap-2">
                <SelectTreasuryToManage treasuryInfos={treasuryInfos} />
                <DialogTreasury />
                <DialogEscrow />
                <DialogTask />
              </div>
            </>
          </PlaceholderComponent>
        </div>
        <div className="col-span-2">
          <PlaceholderComponent
            name="Find Tasks I need to manage"
            userStory="CONTRIBUTION-005"
          >
            <div>Filter and Search Bar</div>
          </PlaceholderComponent>
        </div>
      </div>
    </div>
  );
}
