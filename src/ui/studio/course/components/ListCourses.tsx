import Loading from "~/components/common/loading";
import CourseButtonCard from "./course/CourseButtonCard";
import { Card } from "~/components/ui/card";
import Link from "next/link";
import useUserRelationships from "~/hooks/app/useUserRelationships";

export default function ListCourses() {
  const { courses, isLoading } = useUserRelationships()
  return (
    <>
      {courses.asCreator === undefined && isLoading && (
        <div className="flex min-h-[90vh] items-center">
          <Loading />
        </div>
      )}
      {courses.asCreator && (
        <>
          {courses.asCreator.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {courses.asCreator.map((course) => {
                return (
                  <CourseButtonCard
                    key={course.id}
                    course={course}
                    link={`/studio/course/${course.courseCode}`}
                  />
                );
              })}
            </div>
          ) : (
            <Card size="default">
              <h1>
                You do not have any courses yet
              </h1>
              <p className="pb-5">
                Learn to use Andamio in{" "}
                <Link href="/course/andamio101">
                  <span className="link">Andamio 101</span>.
                </Link>
              </p>
            </Card>
          )}
        </>
      )}
    </>
  );
}
