import { useSession } from "next-auth/react";
import PageSignin from "~/ui/auth/PageSignin";
import { useRouter } from "next/router";
import { LightDarkToggle } from "~/ui/site/LightDarkToggle";
import SideMenu from "~/ui/navigation/SideMenu";
import MenuBar from "~/ui/landing/MenuBar";

export default function ProfileLayout({
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
      {/* <SideMenu /> */}
      <main className="">

        <div className="">
          {children}
        </div>
      </main>
      {/* <LightDarkToggle /> */}
    </div>
  );
}
