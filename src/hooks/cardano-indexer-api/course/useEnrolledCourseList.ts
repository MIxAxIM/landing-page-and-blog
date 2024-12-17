import { api } from "~/utils/api";

export default function useEnrolledCourseList(courseNftPolicyIds: string[]) {
  const { data: courseInfos, isLoading: isLoadingCourseInfos } =
    api.course.getCoursesByPolicyIds.useQuery(
      { courseNftPolicyIds: courseNftPolicyIds },
      { enabled: courseNftPolicyIds.length > 0 },
    );
  return { courseInfos, isLoadingCourseInfos };
}
