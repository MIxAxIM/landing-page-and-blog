import MenuBar from "~/ui/landing/MenuBar";
import { useSession } from "next-auth/react";
import PageSignin from "~/ui/auth/PageSignin";
import { useRouter } from "next/router";
import { LightDarkToggle } from "~/components/common/LightDarkToggle";
import Link from "next/link";

export default function NetworkLayout({
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
      <main className="mx-auto flex min-h-screen w-full flex-row items-center gap-10 py-24 sm:w-11/12 md:w-3/4 lg:w-2/3">
        <div className="mx-auto my-3 grid w-full grid-cols-1 gap-2 py-1 text-sm uppercase md:w-1/3">
          <div className="rounded-sm bg-primary p-[2px] text-center text-primary-foreground opacity-90 hover:opacity-100">
            <Link href="/network">Network</Link>
          </div>
          <div className="rounded-sm bg-primary p-[2px] text-center text-primary-foreground opacity-90 hover:opacity-100">
            <Link href="/network/access-token">Access Token</Link>
          </div>
          <div className="rounded-sm bg-primary p-[2px] text-center text-primary-foreground opacity-90 hover:opacity-100">
            <Link href="/network/access-token/mint">Mint</Link>
          </div>
          <div className="rounded-sm bg-primary p-[2px] text-center text-primary-foreground opacity-90 hover:opacity-100">
            <Link href="/network/dashboard">Dashboard</Link>
          </div>
          <div className="rounded-sm bg-primary p-[2px] text-center text-primary-foreground opacity-90 hover:opacity-100">
            <Link href="/network/access-token/list">List</Link>
          </div>
        </div>
        <div className="lg:w-11/12 xl:w-11/12">{children}</div>
      </main>
      <LightDarkToggle />
    </div>
  );
}
