import { useMemo } from "react"
import { useTerminology } from "~/contexts/terminology-context"
import { type TerminologyKeys } from "~/types/terminology"

type BaseTask = {
  id: string
  titleTemplate: string
  terms?: readonly [TerminologyKeys]
}

const ONBOARDING_TASKS: BaseTask[] = [
  { id: "oLearn", titleTemplate: "Start learning" },
  { id: "oTreasury", titleTemplate: "Start a new %s", terms: ["treasury"] },
  { id: "oContribute", titleTemplate: "Find contribution opportunities" },
  { id: "oTeach", titleTemplate: "Build a new course" },
  { id: "oOrganize", titleTemplate: "Join a %s", terms: ["treasury"] }
] as const

export type OnboardingTask = {
  title: string
  id: string
}

export function useOnboardingTasks() {
  const { translateCaps, skinName, currentSkin } = useTerminology()

  const onboardingTasks = useMemo(() =>
    ONBOARDING_TASKS.map(task => ({
      id: task.id,
      title: task.terms
        ? task.titleTemplate.replace(/%s/g, () => translateCaps(task.terms![0]))
        : task.titleTemplate
    }))
    , [translateCaps, skinName, currentSkin])

  return { onboardingTasks }
}
