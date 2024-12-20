import { useSession } from "next-auth/react";
import Loading from "~/components/common/loading";
import Metatags from "~/components/common/metatags";
import AppLayout from "~/components/layout/AppLayout";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import CreatorCourseListMenu from "~/components/navigation/menu-sections/CreatorCourseListMenu";
import ContributionManagerComponent from "~/ui/app/roles/contribution-manager/ContributionManagerComponent";
import ListCourses from "~/ui/studio/components/ListCourses";

export default function Page() {
  const { data: sessionData, status } = useSession();

  return (
    <DesktopOnlyLayout>
      <AppLayout>
        <Metatags title="Studio" />
        <div className="mx-auto w-3/4 my-24">
          {status === "loading" && (
            <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-56 lg:px-8">
              <Loading />
            </div>
          )}
          <div className="text-center text-4xl">Andamio Studio</div>
          <div className="my-24">
            <ContributionManagerComponent />
          </div>
          <h1>Your Courses</h1>
          <ListCourses />
        </div>
      </AppLayout>
    </DesktopOnlyLayout>
  );
}
