import { useRoles } from "~/hooks/app/useRoles";
import AllTasksListComponent from "../contribution/lists/AllTasksListComponent";
import OnboardRole from "./components/OnboardingComponent";
import { useTerminology } from "~/contexts/terminology-context";

export default function OnboardContributor() {

  const { enableContributor, getContributor, updateContributorOnboardingStatus } = useRoles()

  const { data: contributorStatus } = getContributor()

  return (

    <OnboardRole
      title="Find opportunities to contribute to projects"
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
      <h2 className="prose-h2 text-lg">
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
      <AllTasksListComponent />
    </div>

  )
}
