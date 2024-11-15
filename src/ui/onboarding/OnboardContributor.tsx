import { Button } from "~/components/ui/button";
import { useRoles } from "~/hooks/app/useRoles";
import { Card } from "~/components/ui/card";
import OnboardingStatusButtons from "./components/OnboardingStatusButtons";
import { Badge } from "~/components/ui/badge";
import DialogCourse from "../studio/components/dialogs/DialogCourse";

export default function OnboardContributor() {

  const { enableContributor, getContributor, updateContributorOnboardingStatus } = useRoles()

  const { data: contributorStatus } = getContributor()

  return (
    <div className="flex flex-row justify-between item-center w-full h-full bg-background border border-primary p-5 rounded-sm gap-x-10">
      <div className="flex flex-col w-full  space-y-4">
        <h1 className="prose-h1 text-2xl">Find opportunities to contribute on the Andamio network</h1>
        <Badge className="w-48 py-1">{contributorStatus?.onboardingStatus}</Badge>
        {contributorStatus?.onboardingStatus === "NOT_STARTED" && (
          <Card>
            <h2>Onboarding not started</h2>
            <Button onClick={() => updateContributorOnboardingStatus(contributorStatus.id, "PARTIAL")}>Start now!</Button>
          </Card>
        )}


        {(contributorStatus?.onboardingStatus === "PARTIAL") && (
          <div className="space-y-2">
            <h2 className="prose-h2 text-lg">
              Next step: Make your first contribution
            </h2>
            <Button>Do this task...</Button>
          </div>
        )}

        {(contributorStatus?.onboardingStatus === "SKIPPED" || contributorStatus?.onboardingStatus === "COMPLETE") && (
          <div className="space-y-2">
            <h2 className="prose-h2 text-lg">
              Keep going - here is your next step
            </h2>
          </div>
        )}


        {!contributorStatus && (
          <Button onClick={enableContributor}>Find contribution opportunities on the Andamio network</Button>
        )}
      </div>
      <div>
        {!!contributorStatus?.id &&
          <OnboardingStatusButtons roleId={contributorStatus?.id ?? ""} onStatusChange={updateContributorOnboardingStatus} />
        }

      </div>
    </div>
  );
}
