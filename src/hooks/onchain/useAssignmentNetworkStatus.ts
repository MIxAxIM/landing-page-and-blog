import useAssignment from "../course/useAssignment";
import { NETWORK } from "~/andamio.config";
import useNetworkCourseConfig from "./useNetworkCourseConfig";
import { api } from "~/utils/api";
import { useAccessToken } from "./useAccessToken";

// In each hook, use a dictionary as params

export default function useAssignmentNetworkStatus({
  courseCode,
  moduleCode,
}: {
  courseCode: string;
  moduleCode: string;
}) {
  const {
    assignment,
    isLoadingAssignment,
    isErrorAssignment,
    errorAssignment,
  } = useAssignment(courseCode, moduleCode);

  const { accessTokenAlias } = useAccessToken();
  const { courseOnchain } = useNetworkCourseConfig(courseCode, NETWORK);

  const { data: isAssignmentOnchain, isLoading: isLoadingAssignmentOnchain } =
    api.assignmentValidator.isCourseModuleOnchain.useQuery(
      {
        courseCreatorNFTPolicyID: courseOnchain?.CourseCreatorNFTPolicyID ?? "",
        moduleCode: moduleCode,
      },
      {
        enabled:
          !!courseOnchain &&
          !!courseOnchain.CourseCreatorNFTPolicyID &&
          !!assignment,
      },
    );

  const { data: isLearnerCommitted, isLoading: isLoadingLearnerCommitted } =
    api.assignmentValidator.isLearnerCommittedToAssignment.useQuery(
      {
        courseCreatorNFTPolicyID: courseOnchain?.CourseCreatorNFTPolicyID ?? "",
        assignmentCode: moduleCode ?? "",
        alias: accessTokenAlias ?? "",
      },
      { enabled: !!accessTokenAlias && !!courseOnchain?.CourseCreatorNFTPolicyID },
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
