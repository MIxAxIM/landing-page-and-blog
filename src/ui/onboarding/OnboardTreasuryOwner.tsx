import { Button } from "~/components/ui/button";
import { useRoles } from "~/hooks/app/useRoles";
import DialogTreasury from "../contribution/dialogs/DialogTreasury";
import { Card } from "~/components/ui/card";

// TODO: Build a user journey from first login to Course Contributor status
export default function OnboardTreasuryOwner() {

  const { enableTreasuryOwner, sessionData, getTreasuryOwner } = useRoles()

  const { data: treasuryOwnerStatus } = getTreasuryOwner()

  return (
    <div className="flex flex-col w-full bg-accent p-5 rounded-sm">
      <h1>Add Treasury Owner</h1>
      {!!treasuryOwnerStatus &&
        <div>
          <pre>
            {JSON.stringify(treasuryOwnerStatus, null, 2)}
          </pre>
          <p>Current Status: {treasuryOwnerStatus.onboardingStatus}</p>
        </div>
      }

      {treasuryOwnerStatus?.onboardingStatus === "NOT_STARTED" && (
        <Card>
          <h2>Onboarding not started</h2>
          <Button>Start now!</Button>
        </Card>
      )}


      {(treasuryOwnerStatus?.onboardingStatus === "SKIPPED" || treasuryOwnerStatus?.onboardingStatus === "COMPLETE") && (
        <div>
          <h2>
            You can start your own treasury
          </h2>
          <DialogTreasury />
        </div>
      )}

      {!treasuryOwnerStatus && (
        <Button onClick={enableTreasuryOwner}>Get Ready to Manage a Treasury</Button>
      )}
    </div>
  );
}
