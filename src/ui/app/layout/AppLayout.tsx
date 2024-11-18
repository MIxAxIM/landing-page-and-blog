
import { useSession } from "next-auth/react";
import PageSignin from "~/ui/auth/PageSignin";
import { useRouter } from "next/router";
import SideMenu from "~/ui/navigation/SideMenu";
import AppButtons from "./AppButtons";

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
      <AppButtons />
    </div>
  );
}
