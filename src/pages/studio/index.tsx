import { useSession } from "next-auth/react";
import Loading from "~/components/common/loading";
import Metatags from "~/components/common/metatags";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";

export default function Page() {
  const { data: sessionData, status } = useSession();

  return (
    <DesktopOnlyLayout>
      <Metatags title="Studio" />
      {status === "loading" && (
        <div className="mx-auto mt-32 min-h-[50vh] max-w-7xl px-6 sm:mt-56 lg:px-8">
          <Loading />
        </div>
      )}
      <h1>Welcome to Andamio Studio</h1>
      <h3>How to start building</h3>
    </DesktopOnlyLayout>
  );
}
