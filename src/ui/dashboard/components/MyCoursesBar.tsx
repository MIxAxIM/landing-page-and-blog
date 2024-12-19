import { Button } from "~/components/ui/button";
import Link from "next/link";
import useCourses from "~/hooks/db/course/useCourses";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import Loading from "~/components/common/loading";
import { useEffect, useState } from "react";
import {
  AggregateUserInfoResponse,
} from "@andamiojs/datum-utils";

export function MyCoursesBar({
  aggregateUserInfo,
}: {
  aggregateUserInfo: AggregateUserInfoResponse | undefined;
}) {
  const { courses, isLoadingCourses } = useCourses();
  const [myCourses, setMyCourses] = useState<any>([]);

  useEffect(() => {
    if (aggregateUserInfo) {
      const myOnchainCourses = aggregateUserInfo.courses.ongoing.map(
        (course) => course.policy,
      );
      if (courses) {
        const myCourses = courses.filter((course) =>
          course.courseNftPolicyId
        );
        setMyCourses(myCourses);
      }
    }
  }, [aggregateUserInfo, isLoadingCourses, courses]);

  return (
    <div className="explore-course-bar">
      <h2 className="mb-4 flex justify-between">
        <div className="text-4xl font-bold">My Courses</div>
        <div></div>
      </h2>
      <div className="category">
        <ScrollArea className="w-full">
          <div className="flex space-x-4 pb-4">
            {(isLoadingCourses || !aggregateUserInfo) && <Loading />}
            {!isLoadingCourses &&
              aggregateUserInfo &&
              courses &&
              myCourses.length === 0 ? (
              <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gray-800 text-white shadow-md">
                <p>You have not enrolled in any courses yet.</p>
                <Link href="/course" passHref>
                  <Button className="ml-4">Explore Courses</Button>
                </Link>
              </div>
            ) : (
              myCourses.length !== 0 &&
              myCourses.map((course: any) => (
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
              ))
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}
