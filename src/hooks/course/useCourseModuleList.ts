import { api } from "~/utils/api";

export default function useCourseModuleList(courseCode: string) {
  const { data: courseModuleList, isLoading: isLoadingCourseModuleList } =
    api.module.getCourseModuleList.useQuery({
      courseCode: courseCode,
    });

  return { courseModuleList, isLoadingCourseModuleList };
}
