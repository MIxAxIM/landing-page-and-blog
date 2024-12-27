import { useSession } from "next-auth/react";
import PageSignin from "~/ui/auth/PageSignin";
import { useRouter } from "next/router";
import AppButtons from "./AppButtons";
import MenuBar from "~/ui/landing/MenuBar";

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
      <MenuBar />
      <main className="mt-4">
        <div className="mx-auto flex w-full flex-col justify-center">
          {children}
        </div>
      </main>
      <AppButtons />
    </div>
  );
}
