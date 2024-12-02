import { api } from "~/utils/api";

export default function useCourseById(courseId: string | undefined) {
  const { data: course, isLoading: isLoadingCourse } =
    api.course.getCourseById.useQuery(
      { courseId: courseId! },
      {
        enabled: courseId !== undefined,
      },
    );

  return { course, isLoadingCourse };
}
