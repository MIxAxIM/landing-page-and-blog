import { api } from "~/utils/api";

export default function useCourseModuleWithAssignmentSummary(
  courseCode: string,
) {
  const {
    data: courseModuleOverviews,
    isLoading: isLoadingCourseModules,
    refetch: refetchCourseModules,
  } = api.module.getCourseModuleWithAssignmentSummary.useQuery({
    courseCode: courseCode,
  });

  return {
    courseModuleOverviews,
    isLoadingCourseModules,
    refetchCourseModules,
  };
}
