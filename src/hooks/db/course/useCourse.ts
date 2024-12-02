import { api } from "~/utils/api";

export default function useCourse(courseCode: string | undefined) {
  const { data: course, isLoading: isLoadingCourse } =
    api.course.getCourse.useQuery(
      { courseCode: courseCode! },
      {
        enabled: courseCode !== undefined,
      },
    );

  return { course, isLoadingCourse };
}
