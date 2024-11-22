import { useRoles } from "~/hooks/app/useRoles";
import AllTasksListComponent from "../contribution/lists/AllTasksListComponent";
import OnboardRole from "./components/OnboardingComponent";
import { useTerminology } from "~/contexts/terminology-context";

export default function OnboardOrganizer() {

  const { enableContributionManager, getContributionManager, updateContributionManagerOnboardingStatus } = useRoles()

  const { data: contributionManagerStatus } = getContributionManager()
  const { translateCaps, translateCapsPlural } = useTerminology()

  return (

    <OnboardRole
      title={`Join a ${translateCaps("treasury")} or ${translateCaps("organization")}`}
      cta={`Learn how to join ${translateCapsPlural("treasury")} on Andamio.`}
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
      <h2>
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
