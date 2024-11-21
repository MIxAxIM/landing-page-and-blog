import { useRoles } from "~/hooks/app/useRoles";
import DialogCourse from "../studio/components/dialogs/DialogCourse";
import OnboardRole from "./components/OnboardingComponent";

export default function OnboardCreator() {

  const { enableCreator, getCreator, updateCreatorOnboardingStatus } = useRoles()

  const { data: creatorStatus } = getCreator()

  if (!creatorStatus) return "Not a creator"

  return (
    <OnboardRole
      title="Build a course on Andamio"
      roleStatus={creatorStatus}
      enableRole={enableCreator}
      updateRoleStatus={updateCreatorOnboardingStatus}
      FirstStepContent={FirstStep}
      NextStepContent={NextStep}

    />
  );
}

function FirstStep() {
  return (
    <div>
      <DialogCourse />
    </div>

  )
}

function NextStep() {
  return (
    <div>
      <p>publish your course</p>
    </div>

  )
}
