import { Button } from "~/components/ui/button";
import { useRoles } from "~/hooks/app/useRoles";
import DialogTreasury from "../contribution/dialogs/DialogTreasury";
import { Card } from "~/components/ui/card";
import OnboardingStatusButtons from "./components/OnboardingStatusButtons";
import { Badge } from "~/components/ui/badge";

export default function OnboardTreasuryOwner() {

  const { enableTreasuryOwner, getTreasuryOwner, updateTreasuryManagerOnboardingStatus } = useRoles()

  const { data: treasuryOwnerStatus } = getTreasuryOwner()

  return (
    <div className="flex flex-row justify-between item-center w-full h-full bg-background border border-primary p-5 rounded-sm gap-x-10">
      <div className="flex flex-col w-full  space-y-4">
        <h1 className="prose-h1 text-2xl">Start a Project on Andamio</h1>
        <Badge className="w-48 py-1">{treasuryOwnerStatus?.onboardingStatus}</Badge>
        {treasuryOwnerStatus?.onboardingStatus === "NOT_STARTED" && (
          <Card>
            <h2>Onboarding not started</h2>
            <Button onClick={() => updateTreasuryManagerOnboardingStatus(treasuryOwnerStatus.id, "PARTIAL")}>Start now!</Button>
          </Card>
        )}


        {(treasuryOwnerStatus?.onboardingStatus === "PARTIAL") && (
          <div className="space-y-2">
            <h2 className="prose-h2 text-lg">
              Next step: start your new project
            </h2>
            <DialogTreasury />
          </div>
        )}

        {(treasuryOwnerStatus?.onboardingStatus === "SKIPPED" || treasuryOwnerStatus?.onboardingStatus === "COMPLETE") && (
          <div className="space-y-2">
            <h2 className="prose-h2 text-lg">
              Keep going - here is your next step
            </h2>
          </div>
        )}


        {!treasuryOwnerStatus && (
          <Button onClick={enableTreasuryOwner}>Learn how to start a new project</Button>
        )}
      </div>
      <div>
        {!!treasuryOwnerStatus?.id &&
          <OnboardingStatusButtons roleId={treasuryOwnerStatus?.id ?? ""} onStatusChange={updateTreasuryManagerOnboardingStatus} />
        }

      </div>
    </div>
  );
}


