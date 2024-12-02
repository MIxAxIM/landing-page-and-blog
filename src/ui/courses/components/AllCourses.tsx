import Loading from "~/components/common/loading";
import useCourses from "~/hooks/db/course/useCourses";
import CourseCard from "./CourseCard";
import { useEffect, useState } from "react";
import { type CoursePublic } from "~/types/db";
import useLearnerSavedCourses from "~/hooks/db/course/useLearnerSavedCourses";

export default function AllCourses() {
  const { courses, isLoadingCourses } = useCourses();
  const [featuredCourses, setFeaturedCourses] = useState<CoursePublic[]>([]);
  // const [premiumCourses, setPremiumCourses] = useState<CoursePublic[]>([]);
  // const [networkCourses, setNetworkCourses] = useState<CoursePublic[]>([]);
  const { savedCourses } = useLearnerSavedCourses();

  useEffect(() => {
    if (courses) {
      const _featured = courses.filter((c) => c.accessTier === "FEATURED");
      // const _network = courses.filter((c) => c.accessTier === "NETWORK");
      // const _premium = courses.filter((c) => c.accessTier === "PREMIUM");
      setFeaturedCourses(_featured);
      // setPremiumCourses(_premium);
      // setNetworkCourses(_network);
    }
  }, [courses]);

  return (
    <>
      {isLoadingCourses && <Loading />}
      {courses && (
        <>
          <div className="my-3 border-t border-accent-foreground/50 py-3">
            <h3>
              Featured Courses
            </h3>

            <div
              role="list"
              className="mx-auto grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
            >
              {featuredCourses.map((course) => (
                <>
                  {course && (
                    <CourseCard
                      course={course}
                      savedCourse={
                        savedCourses?.some(
                          (c) => c.courseCode === course.courseCode,
                        ) ?? false
                      }
                    />
                  )}
                </>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
