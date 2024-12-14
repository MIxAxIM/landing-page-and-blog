import { useRoles } from "~/hooks/app/useRoles";
import OnboardRole from "./components/OnboardingComponent";
import { useTerminology } from "~/contexts/terminology-context";

export default function OnboardContributor() {

  const { enableContributor, getContributor, updateContributorOnboardingStatus } = useRoles()

  const { data: contributorStatus } = getContributor()
  const { translateCaps, translateCapsPlural } = useTerminology()

  return (

    <OnboardRole
      title={`Find opportunities to contribute to ${translateCapsPlural("treasury")}`}
      cta={`Learn how to contribute to ${translateCapsPlural("treasury")} on Andamio.`}
      roleStatus={contributorStatus}
      enableRole={enableContributor}
      updateRoleStatus={updateContributorOnboardingStatus}
      FirstStepContent={FirstStep}
      NextStepContent={NextStep}

    />
  );
}
function FirstStep() {
  return (
    <div className="space-y-2">
      <h2>
        Make your first contribution
      </h2>
      <p>Here is a task to get you started...</p>
    </div>

  )
}

function NextStep() {
  const { translateCaps } = useTerminology()
  return (
    <div>
      <p>create a {translateCaps('treasury')} the network</p>
    </div>

  )
}
