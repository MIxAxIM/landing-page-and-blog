import { useSession } from "next-auth/react";
import PageSignin from "~/ui/auth/PageSignin";
import { useRouter } from "next/router";
import SideMenu from "~/components/navigation/SideMenu";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import AppButtons from "./AppButtons";

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
        <div className="mx-auto w-full lg:w-11/12 xl:w-11/12">
          {children}
        </div>
        <AppButtons />
      </main>
    </DesktopOnlyLayout>
  );
}
