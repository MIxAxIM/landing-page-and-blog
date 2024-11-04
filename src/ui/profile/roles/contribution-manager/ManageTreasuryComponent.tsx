import { type Treasury } from "~/types/db";
import PlaceholderComponent from "~/ui/prototype/PlaceholderComponent";
import DialogTreasury from "~/ui/profile/components/dialogs/DialogTreasury";
import DialogEscrow from "~/ui/profile/components/dialogs/DialogEscrow";
import EscrowListComponent from "./EscrowListComponent";
import TaskListComponent from "./TaskListComponent";
import DialogTask from "../../components/dialogs/DialogTask";
import DashboardDataComponent from "../../components/DashboardDataComponent";
import { Button } from "~/components/ui/button";
import DialogPublishTreasuryTx from "../../components/dialogs/DialogPublishTreasuryTx";

export default function ManageTreasuryComponent({
  treasuryInfo,
}: {
  treasuryInfo: Treasury;
}) {
  return (
    <div>
      <div className="mx-auto mb-48 mt-12 grid w-11/12 grid-cols-6 gap-3">
        <div className="col-span-6 flex w-full flex-row items-center justify-between">
          <div className="flex flex-col space-y-2">
            <h2 className="text-4xl">Treasury: {treasuryInfo?.title}</h2>
            <p>CONTRIBUTION-007: View Treasury Dashboard</p>
          </div>

          <div className="flex flex-row space-x-2">
            <DialogTask
              treasuryId={treasuryInfo?.treasuryNftPolicyId}
              key={treasuryInfo?.treasuryNftPolicyId}
            />
            <DialogTreasury
              treasuryNftPolicyId={treasuryInfo?.treasuryNftPolicyId}
            />
            <Button>Add Funds</Button>
            {!!treasuryInfo?.treasuryNftPolicyId && (
              <DialogPublishTreasuryTx
                treasuryId={treasuryInfo?.treasuryNftPolicyId}
              />
            )}
          </div>
        </div>
        <DashboardDataComponent title="total funds in treasury" data="12500" />
        <DashboardDataComponent title="total funds locked" data="3240" />
        <DashboardDataComponent
          title="open tasks"
          data={treasuryInfo?.totalTasks.toString() ?? "0"}
        />
        <DashboardDataComponent title="tasks in progress" data="4" />
        <DashboardDataComponent title="tasks pending review" data="6" />
        <DashboardDataComponent title="approved contributors" data="15" />
        <div className="col-span-6">
          <PlaceholderComponent
            name="List of Active Tasks"
            userStory="CONTRIBUTION-001"
          >
            <>
              {!!treasuryInfo?.treasuryNftPolicyId && (
                <TaskListComponent
                  treasury={treasuryInfo.treasuryNftPolicyId}
                />
              )}
              <DialogTask
                treasuryId={treasuryInfo?.treasuryNftPolicyId}
                key={treasuryInfo?.treasuryNftPolicyId}
              />
            </>
          </PlaceholderComponent>
        </div>
        <div className="col-span-3">
          <PlaceholderComponent
            name="Funds in Escrow"
            userStory="CONTRIBUTION-007"
          >
            <>
              {!!treasuryInfo?.treasuryNftPolicyId && (
                <>
                  <EscrowListComponent
                    treasuryNftPolicyId={
                      treasuryInfo?.treasuryNftPolicyId ?? ""
                    }
                  />
                  <DialogEscrow
                    treasuryId={treasuryInfo.treasuryNftPolicyId}
                    key={treasuryInfo?.treasuryNftPolicyId}
                  />
                </>
              )}
            </>
          </PlaceholderComponent>
        </div>
        <div className="col-span-3">
          <PlaceholderComponent
            name="List of Active Contributors"
            userStory="CONTRIBUTION-001"
          />
        </div>
        <div className="col-span-6">
          <PlaceholderComponent
            name="Manage Treasury Tasks"
            subItems={[
              "Save Task as Draft - CONTRIBUTION-004",
              "Edit and Update Tasks - CONTRIBUTION-006",
              "Publish on Andamio Network",
            ]}
          >
            <>
              <p>CONTRIBUTION-003:</p>
            </>
          </PlaceholderComponent>
        </div>
      </div>
    </div>
  );
}
