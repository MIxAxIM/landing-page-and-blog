import SearchAndamio from "./components/SearchAndamio";
import QuickActionButtons from "./components/QuickActionButtons";
import useCourses from "~/hooks/course/useCourses";
import Loading from "~/components/loading";
import useTreasuries from "~/hooks/contribution/useTreasuries";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

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
        <div className="text-base font-bold">See All</div>
      </h2>
      <div className="category">
        <ScrollArea className="w-full">
          <div className="flex space-x-4 pb-4">
            {isLoadingCourses && <Loading />}
            {courses &&
              courses.map((course) => (
                <div
                  key={course.id}
                  className="item min-w-[180px] rounded-lg bg-gray-800 text-white shadow-md"
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
                </div>
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
        <div className="text-base font-bold">See All</div>
      </h2>
      <ScrollArea className="w-full">
        <div className="flex space-x-4 pb-4">
          {isLoadingTreasuries && <Loading />}
          {treasuries &&
            treasuries.map((treasury) => (
              <div
                key={treasury.id}
                className="item min-w-[180px] rounded-lg bg-gray-800 text-white shadow-md"
              >
                <img
                  src={`images/sample-covers/2.jpg`}
                  alt={treasury.title}
                  className="h-40 w-full rounded-t-lg object-cover"
                />
                <div className="p-2">
                  <p className="font-bold">{treasury.title}</p>
                </div>
              </div>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
