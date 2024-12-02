import { useSession } from "next-auth/react";
import PageSignin from "~/ui/auth/PageSignin";
import { useRouter } from "next/router";
import { LightDarkToggle } from "~/ui/site/LightDarkToggle";
import SideMenu from "~/ui/navigation/SideMenu";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";

export default function StudioLayout({
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
    <DesktopOnlyLayout>
      <SideMenu />
      <main className="py-10 lg:pl-72">
        <div className="mx-auto w-full lg:w-11/12 xl:w-11/12">{children}</div>
      </main>
      <LightDarkToggle />
    </DesktopOnlyLayout>
  );
}
