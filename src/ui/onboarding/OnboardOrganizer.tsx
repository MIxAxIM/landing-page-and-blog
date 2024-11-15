import { Button } from "~/components/ui/button";
import { useRoles } from "~/hooks/app/useRoles";
import { Card } from "~/components/ui/card";
import OnboardingStatusButtons from "./components/OnboardingStatusButtons";
import { Badge } from "~/components/ui/badge";
import AllTasksListComponent from "../contribution/lists/AllTasksListComponent";

export default function OnboardOrganizer() {

  const { enableContributionManager, getContributionManager, updateContributionManagerOnboardingStatus } = useRoles()

  const { data: contributionManagerStatus } = getContributionManager()

  return (
    <div className="flex flex-row justify-between item-center w-full h-full bg-background border border-primary p-5 rounded-sm gap-x-10">
      <div className="flex flex-col w-full  space-y-4">
        <h1 className="prose-h1 text-2xl">Manage Your Organization</h1>
        <Badge className="w-48 py-1">{contributionManagerStatus?.onboardingStatus}</Badge>
        {contributionManagerStatus?.onboardingStatus === "NOT_STARTED" && (
          <Card>
            <h2>Onboarding not started</h2>
            <Button onClick={() => updateContributionManagerOnboardingStatus(contributionManagerStatus.id, "PARTIAL")}>Start now!</Button>
          </Card>
        )}


        {(contributionManagerStatus?.onboardingStatus === "PARTIAL") && (
          <div className="space-y-2">
            <h2 className="prose-h2 text-lg">
              Next step: view projects
            </h2>
            <AllTasksListComponent />
          </div>
        )}

        {(contributionManagerStatus?.onboardingStatus === "SKIPPED" || contributionManagerStatus?.onboardingStatus === "COMPLETE") && (
          <div className="space-y-2">
            <h2 className="prose-h2 text-lg">
              Keep going - here is your next step
            </h2>
          </div>
        )}


        {!contributionManagerStatus && (
          <Button onClick={enableContributionManager}>Join an organize and manage contributions</Button>
        )}
      </div>
      <div>
        {!!contributionManagerStatus?.id &&
          <OnboardingStatusButtons roleId={contributionManagerStatus?.id ?? ""} onStatusChange={updateContributionManagerOnboardingStatus} />
        }

      </div>
    </div>
  );
}
