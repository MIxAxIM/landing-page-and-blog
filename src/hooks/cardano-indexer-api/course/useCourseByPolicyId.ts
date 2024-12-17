import { api } from "~/utils/api";

export default function useCourseByPolicyId(courseNftPolicyId: string) {
  const { data: courseInfo, isLoading: isLoadingCourseInfo } =
    api.course.getCourseByPolicyId.useQuery(
      {
        courseNftPolicyId: courseNftPolicyId,
      },
      { enabled: !!courseNftPolicyId },
    );

  const { data: assignmentStats } =
    api.assignmentValidator.getCourseAssignmentStats.useQuery(
      {
        courseCreatorNFTPolicyID: courseNftPolicyId,
        courseCode: courseInfo?.courseCode ?? "",
      },
      { enabled: !!courseInfo },
    );
  return { courseInfo, isLoadingCourseInfo, assignmentStats };
}
