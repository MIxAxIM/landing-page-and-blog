import { useRoles } from "~/hooks/app/useRoles";
import OnboardRole from "./components/OnboardingComponent";
import { useTerminology } from "~/contexts/terminology-context";
import DialogInitializeProject from "./components/Dialogs/DialogInitializeProject";
import Link from "next/link";

export default function OnboardTreasuryOwner() {

  const { enableTreasuryOwner, getTreasuryOwner, updateTreasuryManagerOnboardingStatus } = useRoles()

  const { data: treasuryOwnerStatus } = getTreasuryOwner()
  const { translateCaps } = useTerminology()
  return (
    <OnboardRole
      title={`Start a ${translateCaps("treasury")} on Andamio`}
      cta={`In this tutorial, you will learn how to build a ${translateCaps("treasury")} on Andamio.`}
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
      <DialogInitializeProject />
    </div>

  )
}

function NextStep() {
  const { translateCaps } = useTerminology()
  return (
    <div>
      <Link href={`/app/projects/`}>View your project</Link>
      <p>create a {translateCaps('task')} the network</p>
    </div>

  )
}
