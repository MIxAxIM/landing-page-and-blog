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
        <div className="col-span-3 flex flex-row items-center justify-between">
          <h2 className="text-4xl">Contribution Manager Dashboard Home</h2>
          <DialogTask />
        </div>
        <div className="col-span-3">
          <h1 className="my-5 text-2xl font-bold">All Network Treasuries</h1>
          <p className="mb-5">
            Product development todo: who should be able to see this list?
            Implement access control in DB + with on-chain credentials
          </p>
          <TreasuryListComponent />
        </div>
        <div className="col-span-1">
          <PlaceholderComponent
            name="Treasury Admin Features"
            userStory="CONTRIBUTION-00x"
          >
            <>
              <p>View tasks by selecting a Treasury</p>
              <div className="grid grid-cols-1 gap-2">
                <SelectTreasuryToManage treasuryInfos={treasuryInfos} />
                <DialogTreasury />
                <DialogEscrow />
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
