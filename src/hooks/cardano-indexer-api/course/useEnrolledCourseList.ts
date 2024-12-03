import { api } from "~/utils/api";

export default function useEnrolledCourseList(courseNftPolicies: string[]) {
  const { data: courseInfos, isLoading: isLoadingCourseInfos } =
    api.courseOnChainInstance.getCoursesByNftPolicyList.useQuery(
      { CourseCreatorNFTPolicyIDs: courseNftPolicies },
      { enabled: courseNftPolicies.length > 0 },
    );
  return { courseInfos, isLoadingCourseInfos };
}
