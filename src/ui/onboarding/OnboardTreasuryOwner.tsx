import { useRoles } from "~/hooks/app/useRoles";
import OnboardRole from "./components/OnboardingComponent";
import { useTerminology } from "~/contexts/terminology-context";
import Link from "next/link";
import DialogInitializeProject from "./components/dialogs/DialogInitializeProject";
import { Button } from "~/components/ui/button";

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
      CompletedContent={Completed}

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
      <Link href={`/studio/project`}>View your project</Link>
      <p>create a {translateCaps('task')} the network</p>
    </div>

  )
}

function Completed() {
  const { translateCapsPlural } = useTerminology()
  return (
    <div className="flex flex-col space-y-4 my-4">
      <p>Great work! You have completed the tutorial.</p>
      <Link href={`/studio/project`}>
        <Button>View my {translateCapsPlural('treasury')}</Button>
      </Link>
    </div>
  )
}
