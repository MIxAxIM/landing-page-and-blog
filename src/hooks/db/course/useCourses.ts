import { api } from "~/utils/api";

export default function useCourses() {
  const { data: courses, isLoading: isLoadingCourses } =
    api.course.getCourses.useQuery();
  return { courses, isLoadingCourses };
}
