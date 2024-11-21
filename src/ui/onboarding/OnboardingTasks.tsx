import { useTerminology } from "~/contexts/terminology-context"


export type OnboardingTask = { title: string, id: string }

export function OnboardingTasks() {
  const { translate } = useTerminology()

  const onboardingTasks: OnboardingTask[] = [
    { title: "Start learning", id: "oLearn" },
    { title: "Start contributing", id: "oContribute" },
    { title: `Start a new ${translate('treasury')}`, id: "oTreasury" },
    { title: "Start teaching", id: "oTeach" },
    { title: `Manage and govern a ${translate('treasury')}`, id: "oOrganize" },
  ]

  return onboardingTasks
}

