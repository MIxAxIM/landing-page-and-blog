import { useRoles } from "~/hooks/app/useRoles";
import AllTasksListComponent from "../contribution/lists/AllTasksListComponent";
import OnboardRole from "./components/OnboardingComponent";

export default function OnboardOrganizer() {

  const { enableContributionManager, getContributionManager, updateContributionManagerOnboardingStatus } = useRoles()

  const { data: contributionManagerStatus } = getContributionManager()

  return (

    <OnboardRole
      title="Manage a Project in an Organization"
      roleStatus={contributionManagerStatus}
      enableRole={enableContributionManager}
      updateRoleStatus={updateContributionManagerOnboardingStatus}
      FirstStepContent={FirstStep}
      NextStepContent={NextStep}

    />
  );
}


function FirstStep() {
  return (
    <div className="space-y-2">
      <h2 className="prose-h2 text-lg">
        Next step: view projects
      </h2>
      <AllTasksListComponent />
    </div>

  )
}

function NextStep() {
  return (
    <div>
      <p>get involved by following these steps...</p>
    </div>

  )
}
