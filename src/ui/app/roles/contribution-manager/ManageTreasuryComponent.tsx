import { type Treasury } from "~/types/db";
import PlaceholderComponent from "~/components/placeholders/PlaceholderComponent";
import { Button } from "~/components/ui/button";
import DialogEscrow from "~/ui/contribution/dialogs/DialogEscrow";
import DialogPublishTreasuryTx from "~/ui/contribution/dialogs/DialogPublishTreasuryTx";
import DialogTask from "~/ui/contribution/dialogs/DialogTask";
import DialogTreasury from "~/ui/contribution/dialogs/DialogTreasury";
import EscrowListComponent from "~/ui/contribution/lists/EscrowListComponent";
import TreasuryTaskListComponent from "~/ui/contribution/lists/TreasuryTaskListComponent";
import DashboardDataComponent from "~/ui/dashboard/components/DashboardDataComponent";
import { useTerminology } from "~/contexts/terminology-context";

export default function ManageTreasuryComponent({
  treasuryInfo,
}: {
  treasuryInfo: Treasury;
}) {
  const { translate, translateCaps } = useTerminology();
  return (
    <div>
      <div className="mx-auto mb-48 mt-12 grid w-11/12 grid-cols-6 gap-3">
        <div className="col-span-6 flex w-full flex-row items-center justify-between mb-6">
          <div className="">
            <h2>{treasuryInfo?.title}</h2>
          </div>

          <div className="flex flex-row space-x-2">
            <DialogTask
              treasuryId={treasuryInfo?.id}
              key={treasuryInfo?.treasuryNftPolicyId}
            />
            <DialogTreasury
              treasuryId={treasuryInfo?.id}
            />
            <Button>Add Funds</Button>
            {!!treasuryInfo?.treasuryNftPolicyId && (
              <DialogPublishTreasuryTx
                treasuryId={treasuryInfo?.treasuryNftPolicyId}
              />
            )}
          </div>
        </div>
        <DashboardDataComponent title={`total funds in ${translate('treasury')}`} data="0" />
        <DashboardDataComponent
          title="allocated ada"
          data={(treasuryInfo?.totalAda ?? 0).toString()}
        />
        <DashboardDataComponent
          title="open tasks"
          data={treasuryInfo?.totalTasks.toString() ?? "0"}
        />
        <DashboardDataComponent title={`${translate('task')} in progress`} data="0" />
        <DashboardDataComponent title={`${translate('task')} pending review`} data="0" />
        <DashboardDataComponent title={`approved ${translate('contributor')}`} data="0" />
        <div className="col-span-6">
          <PlaceholderComponent
            name={`Current ${translateCaps('treasury')}`}
            userStory="CONTRIBUTION-007"
          >
            <>
              {!!treasuryInfo?.id && (
                <>
                  <EscrowListComponent
                    treasuryId={
                      treasuryInfo?.id ?? ""
                    }
                  />
                  <DialogEscrow
                    treasuryId={treasuryInfo.id}
                    key={treasuryInfo?.id}
                  />
                </>
              )}
            </>
          </PlaceholderComponent>
        </div>
        <div className="col-span-6">
          <PlaceholderComponent
            name="List of Active Tasks"
            userStory="CONTRIBUTION-001"
          >
            <>
              {!!treasuryInfo?.treasuryNftPolicyId && (
                <TreasuryTaskListComponent
                  treasury={treasuryInfo.treasuryNftPolicyId}
                />
              )}
              <DialogTask
                treasuryId={treasuryInfo?.id}
                key={treasuryInfo?.treasuryNftPolicyId}
              />
            </>
          </PlaceholderComponent>
        </div>
        <div className="col-span-2">
          <PlaceholderComponent
            name="List of Active Contributors"
            userStory="CONTRIBUTION-001"
          />
        </div>
        <div className="col-span-2">
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
