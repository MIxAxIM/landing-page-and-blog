import { useRoles } from "~/hooks/app/useRoles";
import DialogTreasury from "../contribution/dialogs/DialogTreasury";
import OnboardRole from "./components/OnboardingComponent";
import { useTerminology } from "~/contexts/terminology-context";

export default function OnboardTreasuryOwner() {

  const { enableTreasuryOwner, getTreasuryOwner, updateTreasuryManagerOnboardingStatus } = useRoles()

  const { data: treasuryOwnerStatus } = getTreasuryOwner()

  return (
    <OnboardRole
      title="Start a Project on Andamio"
      roleStatus={treasuryOwnerStatus}
      enableRole={enableTreasuryOwner}
      updateRoleStatus={updateTreasuryManagerOnboardingStatus}
      FirstStepContent={FirstStep}
      NextStepContent={NextStep}

    />
  );
}


function FirstStep() {
  return (
    <div className="space-y-2">
      <h2 className="prose-h2 text-lg">
        Next step: start your new project
      </h2>
      <DialogTreasury />
    </div>

  )
}

function NextStep() {
  const { translateCaps } = useTerminology()
  return (
    <div>
      <p>create a {translateCaps('task')} the network</p>
    </div>

  )
}
