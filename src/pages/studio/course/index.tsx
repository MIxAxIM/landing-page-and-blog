import { useSession } from "next-auth/react";
import Loading from "~/components/common/loading";
import Metatags from "~/components/common/metatags";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import { useRoles } from "~/hooks/app/useRoles";
import { useEffect } from "react";
import PageStudio from "~/ui/studio/course/PageStudio";

export default function StudioCourseLandingPage() {
  const { data: sessionData, status } = useSession();
  const { enableCreator } = useRoles()

  useEffect(() => {
    if (sessionData?.user && !sessionData.user.creatorId) {
      void enableCreator();
    }
  }, [sessionData, enableCreator]);

  return (
    <DesktopOnlyLayout>
      <Metatags title="Studio" />
      {status === "loading" && (
        <div className="mx-auto mt-32 min-h-[50vh] max-w-7xl px-6 sm:mt-56 lg:px-8">
          <Loading />
        </div>
      )}
      {sessionData && sessionData.user.creatorId && <PageStudio />}
    </DesktopOnlyLayout>
  );
}
