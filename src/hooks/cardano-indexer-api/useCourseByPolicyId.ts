import { api } from "~/utils/api";

export default function useCourseByPolicyId(courseNftPolicy: string) {
  const { data: courseInfo, isLoading: isLoadingCourseInfo } =
    api.courseOnChainInstance.getCourseByCourseNftPolicy.useQuery(
      {
        CourseCreatorNFTPolicyID: courseNftPolicy,
      },
      { enabled: !!courseNftPolicy },
    );

  const { data: assignmentStats } =
    api.assignmentValidator.getCourseAssignmentStats.useQuery(
      {
        courseCreatorNFTPolicyID: courseNftPolicy,
        courseCode: courseInfo?.courseCode ?? "",
      },
      { enabled: !!courseInfo },
    );
  return { courseInfo, isLoadingCourseInfo, assignmentStats };
}
