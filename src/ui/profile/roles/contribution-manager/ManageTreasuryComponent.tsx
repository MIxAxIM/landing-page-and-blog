import { type Treasury } from "~/types/db";
import PlaceholderComponent from "~/ui/prototype/PlaceholderComponent";
import DialogTreasury from "~/ui/profile/components/dialogs/DialogTreasury";
import DialogEscrow from "~/ui/profile/components/dialogs/DialogEscrow";
import EscrowListComponent from "./EscrowListComponent";
import TaskListComponent from "./TaskListComponent";
import DialogTask from "../../components/dialogs/DialogTask";

export default function ManageTreasuryComponent({
  treasuryInfo,
}: {
  treasuryInfo: Treasury;
}) {
  return (
    <div>
      <div className="mx-auto mt-12 grid w-11/12 grid-cols-3 gap-3">
        <div className="col-span-3">
          <h2 className="text-4xl">{treasuryInfo?.title}</h2>
          <p>CONTRIBUTION-007: View Treasury Dashboard</p>
          <DialogTreasury
            treasuryNftPolicyId={treasuryInfo?.treasuryNftPolicyId}
          />
        </div>
        <div className="col-span-3">
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
        <div className="">
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
              <DialogTask
                treasuryId={treasuryInfo?.treasuryNftPolicyId}
                key={treasuryInfo?.treasuryNftPolicyId}
              />
            </>
          </PlaceholderComponent>
        </div>
        <div className="col-span-1">
          <PlaceholderComponent
            name="Treasury Balance"
            userStory="CONTRIBUTION-007"
          />
        </div>
        <div className="col-span-2">
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
        <div className="col-span-1">
          <PlaceholderComponent
            name="Add Funds to Treasury"
            userStory="CONTRIBUTION-008"
          />
        </div>
        <div className="col-span-2">
          <PlaceholderComponent
            name="List of Active Contributors"
            userStory="CONTRIBUTION-001"
          />
        </div>
      </div>
    </div>
  );
}
