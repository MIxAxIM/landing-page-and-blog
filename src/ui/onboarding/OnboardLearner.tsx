import { Button } from "~/components/ui/button";
import { useRoles } from "~/hooks/app/useRoles";
import { Card } from "~/components/ui/card";
import OnboardingStatusButtons from "./components/OnboardingStatusButtons";
import { Badge } from "~/components/ui/badge";
import AllCourses from "../courses/components/AllCourses";

export default function OnboardLearner() {

  const { enableLearner, getLearner, updateLearnerOnboardingStatus } = useRoles()

  const { data: learnerStatus } = getLearner()

  return (
    <div className="flex flex-row justify-between item-center w-full h-full bg-background border border-primary p-5 rounded-sm gap-x-10">
      <div className="flex flex-col w-full  space-y-4">
        <h1 className="prose-h1 text-2xl">Start learning on Andamio</h1>
        <Badge className="w-48 py-1">{learnerStatus?.onboardingStatus}</Badge>
        {learnerStatus?.onboardingStatus === "NOT_STARTED" && (
          <Card>
            <h2>Onboarding not started</h2>
            <Button onClick={() => updateLearnerOnboardingStatus(learnerStatus.id, "PARTIAL")}>Start now!</Button>
          </Card>
        )}


        {(learnerStatus?.onboardingStatus === "PARTIAL") && (
          <div className="space-y-2">
            <h2 className="prose-h2 text-lg">
              Explore courses
            </h2>
            <AllCourses />
          </div>
        )}

        {(learnerStatus?.onboardingStatus === "SKIPPED" || learnerStatus?.onboardingStatus === "COMPLETE") && (
          <div className="space-y-2">
            <h2 className="prose-h2 text-lg">
              Keep going - here is your next step
            </h2>
          </div>
        )}


        {!learnerStatus && (
          <Button onClick={enableLearner}>Start learning on Andamio</Button>
        )}
      </div>
      <div>
        {!!learnerStatus?.id &&
          <OnboardingStatusButtons roleId={learnerStatus?.id ?? ""} onStatusChange={updateLearnerOnboardingStatus} />
        }

      </div>
    </div>
  );
}
