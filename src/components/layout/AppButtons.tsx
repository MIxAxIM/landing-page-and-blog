import { LightDarkToggle } from "~/components/common/LightDarkToggle";
import AndamioRoleStatusMenu from "~/components/navigation/menu-sections/AndamioRoleStatusMenu";
import { TerminologyToggle } from "../common/TerminologyToggle";
import FloatingStatusButton from "../common/FloatingStatusButton";

export default function AppButtons() {

  return (
    <div className="fixed bottom-[96px] right-5 flex flex-col space-y-8 items-center justify-center">
      <FloatingStatusButton defaultOpen={false}>
        <h2>Andamio Onboarding Status</h2>
        <p>Check here any time to see how you are doing</p>
        <AndamioRoleStatusMenu dashboardChildRoute="/" />
      </FloatingStatusButton>
      <TerminologyToggle />
      <LightDarkToggle />
    </div>
  )
}

