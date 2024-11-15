
import { useSession } from "next-auth/react";
import PageSignin from "~/ui/auth/PageSignin";
import { useRouter } from "next/router";
import { LightDarkToggle } from "~/ui/site/LightDarkToggle";
import SideMenu from "~/ui/navigation/SideMenu";
import FloatingStatusButton from "../components/FloatingStatusButton";
import AndamioRoleStatusMenu from "~/ui/navigation/menu-sections/AndamioRoleStatusMenu";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: sessionData } = useSession();
  const route = useRouter();

  if (sessionData === null) {
    return <PageSignin redirectUrl={route.asPath} />;
  }

  return (
    <div>
      <SideMenu />
      <main className="lg:pl-80">
        <div className="mx-auto flex w-full flex-col justify-center">
          {children}
        </div>
      </main>
      <LightDarkToggle />
      <FloatingStatusButton defaultOpen={true}>
        <h2 className="prose-h2 text-2xl mb-8">Andamio Onboarding Status</h2>
        <p>Check here any time to see how you are doing</p>
        <AndamioRoleStatusMenu dashboardChildRoute="/" />
      </FloatingStatusButton>
    </div>
  );
}
