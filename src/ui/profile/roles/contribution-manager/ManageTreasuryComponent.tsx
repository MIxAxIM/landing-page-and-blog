import { type Treasury } from "~/types/db";
import PlaceholderComponent from "~/ui/prototype/PlaceholderComponent";
import DashboardDataComponent from "../../components/DashboardDataComponent";
import { Button } from "~/components/ui/button";
import DialogEscrow from "~/ui/contribution/dialogs/DialogEscrow";
import DialogPublishTreasuryTx from "~/ui/contribution/dialogs/DialogPublishTreasuryTx";
import DialogTask from "~/ui/contribution/dialogs/DialogTask";
import DialogTreasury from "~/ui/contribution/dialogs/DialogTreasury";
import EscrowListComponent from "~/ui/contribution/lists/EscrowListComponent";
import TaskListComponent from "~/ui/contribution/lists/TaskListComponent";

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
        <DashboardDataComponent title="total funds in treasury" data="0" />
        <DashboardDataComponent
          title="allocated ada"
          data={(treasuryInfo?.totalAda ?? 0).toString()}
        />
        <DashboardDataComponent
          title="open tasks"
          data={treasuryInfo?.totalTasks.toString() ?? "0"}
        />
        <DashboardDataComponent title="tasks in progress" data="0" />
        <DashboardDataComponent title="tasks pending review" data="0" />
        <DashboardDataComponent title="approved contributors" data="0" />
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
        <div className="col-span-4">
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
        <div className="col-span-2">
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
