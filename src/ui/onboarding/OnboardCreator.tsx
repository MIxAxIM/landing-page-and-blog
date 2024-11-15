import { Button } from "~/components/ui/button";
import { useRoles } from "~/hooks/app/useRoles";
import { Card } from "~/components/ui/card";
import OnboardingStatusButtons from "./components/OnboardingStatusButtons";
import { Badge } from "~/components/ui/badge";
import DialogCourse from "../studio/components/dialogs/DialogCourse";

export default function OnboardCreator() {

  const { enableCreator, getCreator, updateCreatorOnboardingStatus } = useRoles()

  const { data: creatorStatus } = getCreator()

  return (
    <div className="flex flex-row justify-between item-center w-full h-full bg-background border border-primary p-5 rounded-sm gap-x-10">
      <div className="flex flex-col w-full  space-y-4">
        <h1 className="prose-h1 text-2xl">Build a course on Andamio</h1>
        <Badge className="w-48 py-1">{creatorStatus?.onboardingStatus}</Badge>
        {creatorStatus?.onboardingStatus === "NOT_STARTED" && (
          <Card>
            <h2>Onboarding not started</h2>
            <Button onClick={() => updateCreatorOnboardingStatus(creatorStatus.id, "PARTIAL")}>Start now!</Button>
          </Card>
        )}


        {(creatorStatus?.onboardingStatus === "PARTIAL") && (
          <div className="space-y-2">
            <h2 className="prose-h2 text-lg">
              Next step: start a new course
            </h2>
            <DialogCourse />
          </div>
        )}

        {(creatorStatus?.onboardingStatus === "SKIPPED" || creatorStatus?.onboardingStatus === "COMPLETE") && (
          <div className="space-y-2">
            <h2 className="prose-h2 text-lg">
              Keep going - here is your next step
            </h2>
          </div>
        )}


        {!creatorStatus && (
          <Button onClick={enableCreator}>Learn how to build a course on Andamio</Button>
        )}
      </div>
      <div>
        {!!creatorStatus?.id &&
          <OnboardingStatusButtons roleId={creatorStatus?.id ?? ""} onStatusChange={updateCreatorOnboardingStatus} />
        }

      </div>
    </div>
  );
}
