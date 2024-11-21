import Loading from "~/components/loading";
import CourseButtonCard from "./course/CourseButtonCard";
import { Card } from "~/components/ui/card";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import useCoursesByOwner from "~/hooks/course/useCoursesByOwner";

export default function ListCourses() {
  const { ownerCourses, isLoadingCourses } = useCoursesByOwner();
  return (
    <>
      {ownerCourses === undefined && isLoadingCourses && (
        <div className="flex min-h-[90vh] items-center">
          <Loading />
        </div>
      )}
      {ownerCourses && (
        <>
          {ownerCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {ownerCourses.map((course) => {
                return (
                  <CourseButtonCard
                    key={course.id}
                    course={course}
                    link={`/studio/${course.courseCode}`}
                  />
                );
              })}
            </div>
          ) : (
            <Card intent="default" size="default">
              <h1>
                You do not have any courses yet
              </h1>
              <p className="pb-5">
                To build courses in Andamio, you must first complete the{" "}
                <Link href="/course/andamio101">
                  <span className="link">Andamio 101 Course</span>.
                </Link>
              </p>
              <Link href="/course/andamio101">
                <Button>Get Started</Button>
              </Link>
            </Card>
          )}
        </>
      )}
    </>
  );
}
