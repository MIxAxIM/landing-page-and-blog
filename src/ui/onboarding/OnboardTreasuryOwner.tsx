import { useRoles } from "~/hooks/app/useRoles";
import OnboardRole from "./components/OnboardingComponent";
import { useTerminology } from "~/contexts/terminology-context";
import DialogInitializeProject from "./components/Dialogs/DialogInitializeProject";

export default function OnboardTreasuryOwner() {

  const { enableTreasuryOwner, getTreasuryOwner, updateTreasuryManagerOnboardingStatus } = useRoles()

  const { data: treasuryOwnerStatus } = getTreasuryOwner()
  const { translateCaps } = useTerminology()
  return (
    <OnboardRole
      title={`Start a ${translateCaps("treasury")} on Andamio`}
      cta={`Learn how to build a ${translateCaps("treasury")} on Andamio.`}
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
      <h2>
        Next step: start your new project
      </h2>
      <DialogInitializeProject />
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
