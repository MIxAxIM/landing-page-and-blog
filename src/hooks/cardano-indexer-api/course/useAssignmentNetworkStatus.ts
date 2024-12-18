import { api } from "~/utils/api";
import useAssignment from "~/hooks/db/course/useAssignment";
import { useAccessToken } from "../network/useAccessToken";

// In each hook, use a dictionary as params

export default function useAssignmentNetworkStatus({
  courseCode,
  moduleCode,
  courseNftPolicyId,
}: {
  courseCode: string;
  moduleCode: string;
  courseNftPolicyId: string;
}) {
  const {
    assignment,
    isLoadingAssignment,
    isErrorAssignment,
    errorAssignment,
  } = useAssignment(courseCode, moduleCode);

  const { accessTokenAlias } = useAccessToken();

  const { data: isAssignmentOnchain, isLoading: isLoadingAssignmentOnchain } =
    api.assignmentValidator.isCourseModuleOnchain.useQuery(
      {
        courseCreatorNFTPolicyID: courseNftPolicyId ?? "",
        moduleCode: moduleCode,
      },
      {
        enabled: courseNftPolicyId?.length === 56 && !!assignment
      },
    );

  const { data: isLearnerCommitted, isLoading: isLoadingLearnerCommitted } =
    api.assignmentValidator.isLearnerCommittedToAssignment.useQuery(
      {
        courseCreatorNFTPolicyID: courseNftPolicyId ?? "",
        assignmentCode: moduleCode ?? "",
        alias: accessTokenAlias ?? "",
      },
      { enabled: !!accessTokenAlias && !!courseNftPolicyId },
    );

  return {
    assignment,
    isLoadingAssignment,
    isErrorAssignment,
    errorAssignment,
    isAssignmentOnchain,
    isLoadingAssignmentOnchain,
    isLearnerCommitted,
    isLoadingLearnerCommitted,
  };
}
