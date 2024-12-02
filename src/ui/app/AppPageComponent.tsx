import SearchAndamio from "./components/SearchAndamio";
import QuickActionButtons from "./components/QuickActionButtons";
import useCourses from "~/hooks/db/course/useCourses";
import Loading from "~/components/loading";
import useTreasuries from "~/hooks/db/contribution/useTreasuries";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import Link from "next/link";

export default function AppPageComponent() {
  return (
    <div className="mx-auto my-auto max-w-7xl text-center">
      {/* <div className="text-2xl font-bold">Welcome to Andamio</div> */}

      {/*--- TODO: These messages can be customized based on user status ---*/}
      {/* <div className="text-6xl my-24">What do you want to work  on today?</div> */}
      <div className="mb-8 text-xl font-light">
        Type &quot;start learning&quot; in the search bar, or choose a button
        below
      </div>

      {/*--- Search and quick actions buttons should provide: ---*/}
      {/*--- 1. for newcomers, quick access to onboarding and public views ---*/}
      {/*--- 2. for experienced users, quick access to relevant stuff ---*/}
      <SearchAndamio />
      {/* <QuickActionButtons /> */}

      <ExploreCoursesBar />
      <ExploreProjectsBar />
    </div>
  );
}

export function ExploreCoursesBar() {
  const { courses, isLoadingCourses } = useCourses();
  return (
    <div className="explore-courses-bar">
      <h2 className="mb-4 flex justify-between">
        <div className="text-4xl font-bold">Explore Courses</div>
        <Link href="/courses" className="text-base font-bold">See All</Link>
      </h2>
      <div className="category">
        <ScrollArea className="w-full">
          <div className="flex space-x-4 pb-4">
            {isLoadingCourses && <Loading />}
            {courses &&
              courses.map((course) => (
                <Link
                  href={`/app/course/${course.courseCode}`}
                  passHref
                  key={course.id}
                  className="item min-w-[180px] transform rounded-lg bg-gray-800 text-white shadow-md transition-transform hover:scale-105 hover:shadow-lg"
                >
                  <img
                    src={
                      course.imageUrl
                        ? course.imageUrl
                        : `images/sample-covers/4.jpg`
                    }
                    alt={course.title}
                    className="h-40 w-full rounded-t-lg object-cover"
                  />
                  <div className="p-2">
                    <p className="font-bold">{course.title}</p>
                  </div>
                </Link>
              ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

export function ExploreProjectsBar() {
  const { treasuries, isLoadingTreasuries } = useTreasuries();
  return (
    <div className="explore-projects-bar">
      <h2 className="mb-4 flex justify-between">
        <div className="text-4xl font-bold">Explore Projects</div>
        <Link href="/projects" className="text-base font-bold">See All</Link>
      </h2>
      <ScrollArea className="w-full">
        <div className="flex space-x-4 pb-4">
          {isLoadingTreasuries && <Loading />}
          {treasuries &&
            treasuries.map((treasury) => (
              <Link
                href={`/app/project/${treasury.id}`}
                passHref
                key={treasury.id}
                className="item min-w-[180px] transform rounded-lg bg-gray-800 text-white shadow-md transition-transform hover:scale-105 hover:shadow-lg"
              >
                {Math.random() > 0.5 ? (
                  <span
                    className={`absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-xs font-bold text-white
                  `}
                  >
                    prerequisite
                  </span>
                ) : (
                  <span
                    className={`absolute left-2 top-2 rounded bg-green-500 px-2 py-1 text-xs font-bold text-white
                    `}
                  >
                    no prerequisite
                  </span>
                )}
                <img
                  src={`images/sample-covers/2.jpg`}
                  alt={treasury.title}
                  className="h-40 w-full rounded-t-lg object-cover"
                />
                <div className="p-2">
                  <p className="font-bold">{treasury.title}</p>
                </div>
              </Link>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
