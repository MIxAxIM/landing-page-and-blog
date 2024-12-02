import { LightDarkToggle } from "~/components/common/LightDarkToggle";
import { useSession } from "next-auth/react";
import AndamioRoleStatusMenu from "~/components/navigation/menu-sections/AndamioRoleStatusMenu";
import { TerminologyToggle } from "../common/TerminologyToggle";
import FloatingStatusButton from "../common/FloatingStatusButton";

export default function AppButtons() {

  const { data: sessionData } = useSession();

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


// Light Dark:
// className="fixed bottom-[85px] right-5 z-50 rounded-full p-3"
//
// Floating:
// (Has animiation too!)
// className="fixed bottom-[150px] right-5 z-50 rounded-full p-3 bg-inherit"
