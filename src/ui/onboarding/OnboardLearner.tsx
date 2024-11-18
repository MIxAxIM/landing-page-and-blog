import AllCourses from "../courses/components/AllCourses";
import { useRoles } from "~/hooks/app/useRoles";
import OnboardRole from "./components/OnboardingComponent";
import PlaceholderComponent from "../prototype/PlaceholderComponent";

export default function OnboardLearner() {
  const { enableLearner, getLearner, updateLearnerOnboardingStatus } = useRoles();
  const { data: learnerStatus } = getLearner();

  return (
    <OnboardRole
      title="Start learning on Andamio"
      roleStatus={learnerStatus}
      enableRole={enableLearner}
      updateRoleStatus={updateLearnerOnboardingStatus}
      FirstStepContent={FirstLesson}
      NextStepContent={AllCourses}
    />
  );
}

function FirstLesson() {
  return (
    <div>
      <PlaceholderComponent name="A first example lesson, just to get you going. Make individual lessons visible in this UX" />
    </div>
  )
}
