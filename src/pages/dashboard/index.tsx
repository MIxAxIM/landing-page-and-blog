import { useSession } from "next-auth/react";
import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import Loading from "~/components/loading";
import DashboardPageComponent from "~/ui/dashboard/DashboardPageComponent";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: sessionData, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);
  return (
    <DesktopOnlyLayout>
      {status === "loading" && (
        <div className="mx-auto mt-32 min-h-[50vh] max-w-7xl px-6 sm:mt-56 lg:px-8">
          <Loading />
        </div>
      )}
      {sessionData && sessionData.user && <DashboardPageComponent />}
    </DesktopOnlyLayout>
  );
}
