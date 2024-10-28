import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useCourse from "~/hooks/course/useCourse";
import useValidateCreator from "~/hooks/course/useValidateCreator";
import { type Course } from "~/types/db";
import SideMenuSessionProfile from "~/ui/auth/SideMenuSessionProfile";
import CourseOutline from "../course/components/layout/SideMenu/CourseOutline";
import StudioOutline from "../studio/components/layout/SideMenu/StudioOutline";
import { CourseStudioLinkItem, DashboardLinkItem } from "./link-items";
import { BrowseCoursesSideMenu } from "./link-items/BrowseCoursesSideMenu";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DesktopSideMenu({
  ownerCourses,
  currentCourseCode,
}: {
  ownerCourses?: Course[];
  currentCourseCode: string | undefined;
}) {
  const { data: sessionData } = useSession();

  const router = useRouter();

  const [dashboardChildRoute, setDashboardChildRoute] = useState<
    string | undefined
  >(undefined);

  // const [dashboardState, setDashboardState] = useState<DashboardRoleItem[]>(dashboards)

  const isDashboardRoute = router.asPath.includes("dashboard");
  const isStudioRoute = router.asPath.includes("studio");
  const isCourseRoute = router.asPath.includes("course");

  const { coursecode, modulecode } = router.query;
  const hasCourseCode = typeof coursecode === "string";
  const hasModuleCode = typeof modulecode === "string";

  const isStudioContentRoute = isStudioRoute && hasCourseCode && hasModuleCode;

  const { course } = useCourse(currentCourseCode);

  const { isCreator } = useValidateCreator(
    sessionData,
    currentCourseCode ?? "",
  );

  useEffect(() => {
    const isDashboardLearnerRoute = router.asPath.includes("dashboard/learner");
    const isDashboardTeacherRoute = router.asPath.includes("dashboard/teacher");
    const isDashboardContributionManagerRoute = router.asPath.includes(
      "dashboard/contribution-manager",
    );
    const isDashboardContributorRoute = router.asPath.includes(
      "dashboard/contributor",
    );
    if (isDashboardLearnerRoute) setDashboardChildRoute("learner");
    if (isDashboardContributorRoute) setDashboardChildRoute("contributor");
    if (isDashboardTeacherRoute) setDashboardChildRoute("teacher");
    if (isDashboardContributionManagerRoute)
      setDashboardChildRoute("contribution-manager");
  }, [router]);

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-foreground bg-background">
        {/* Andamio Logo */}
        <div className="mb-5 mt-10 flex items-center justify-center">
          <Link href="/">
            <Image
              width={125}
              height={125}
              className="justify-center"
              src="/andamio-logo-no-white-overflow.png"
              alt="Andamio"
            />
          </Link>
        </div>
        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col">
            {/* Top level routes: Studio, Dashboard and Courses */}
            {!isStudioContentRoute && (
              <li className="mb-7">
                <ul role="list" className="space-y-1 px-3">
                  {/* Dashboard */}
                  <DashboardLinkItem
                    current={isDashboardRoute}
                    dashboardChildRoute={dashboardChildRoute ?? ""}
                  />
                  {/* Studio */}
                  {isCreator && (
                    <CourseStudioLinkItem
                      current={isStudioRoute}
                      ownerCourses={ownerCourses ?? []}
                    />
                  )}
                  {/* Link to Public Courses */}
                  <BrowseCoursesSideMenu current={false} />
                </ul>
              </li>
            )}

            {/* Course Outline in Edit Mode */}
            {isStudioContentRoute && course && (
              <>
                <div className=" p-2">
                  <p className="text-sm">editing:</p>
                  <h2 className="text-xl font-semibold">{course.title}</h2>
                </div>
                <StudioOutline
                  currentCourseCode={coursecode}
                  isCreator={true}
                />
              </>
            )}

            {/* Course Outline in Published Mode */}
            {isCourseRoute && !!currentCourseCode && (
              <li>
                <ul role="list" className="space-y-1 px-2">
                  <li>
                    <Link
                      href={`/course/${currentCourseCode}`}
                      className={classNames(
                        "hover:text-accent-foreground-foreground text-foreground hover:bg-accent",
                        "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",
                      )}
                    >
                      <AcademicCapIcon
                        className={classNames(
                          "text-accent-foreground-foreground group-hover:text-accent-foreground-foreground",
                          "h-6 w-6 shrink-0",
                        )}
                        aria-hidden="true"
                      />
                      {course?.title}
                    </Link>
                  </li>
                </ul>
                <CourseOutline
                  currentCourseCode={currentCourseCode}
                  isCreator={isCreator}
                />
              </li>
            )}

            {/* Profile in menu footer */}
            <SideMenuSessionProfile />
          </ul>
        </nav>
      </div>
    </div>
  );
}
