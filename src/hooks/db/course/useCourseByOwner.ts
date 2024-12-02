import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { type Course } from "~/types/db";

export default function useCourseByOwner(courseCode: string) {
  const { data: sessionData } = useSession();
  const { data: ownerCourses, isLoading: isLoadingCourse } =
    api.course.getCoursesByOwner.useQuery(undefined, {
      enabled: !!sessionData && !!courseCode
    });
  const course = ownerCourses?.find(
    (c: Course) => c?.courseCode === courseCode,
  );
  return { course, isLoadingCourse };
}
