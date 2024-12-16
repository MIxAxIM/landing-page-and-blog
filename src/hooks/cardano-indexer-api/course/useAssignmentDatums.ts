import { api } from "~/utils/api";

export default function useAssignmentDatums(
  courseNftPolicy: string,
  alias?: string,
) {

  const {
    data: listCourseAssignmentDatums,
    isLoading: isLoadingListCourseAssignmentDatums,
    isError: isErrorListCourseAssignmentDatums,
    error: errorListCourseAssignmentDatums,
  } = api.assignmentValidator.getDecodedCourseAssignmentDatums.useQuery(
    {
      courseNftPolicyId: courseNftPolicy,
    },
    { enabled: !alias && !!courseNftPolicy },
  );

  const {
    data: assignmentDatum,
    isLoading: isLoadingAssignmentDatum,
    isError: isErrorAssignmentDatum,
    error: errorAssignmentDatum,
  } = api.assignmentValidator.getDecodedCourseAssignmentDatumsByAlias.useQuery(
    {
      courseCreatorNFTPolicyID: courseNftPolicy,
      alias: alias!,
    },
    {
      enabled: !!alias && !!courseNftPolicy,
    },
  );

  return {
    listCourseAssignmentDatums,
    isLoadingListCourseAssignmentDatums,
    isErrorListCourseAssignmentDatums,
    errorListCourseAssignmentDatums,
    assignmentDatum,
    isLoadingAssignmentDatum,
    isErrorAssignmentDatum,
    errorAssignmentDatum,
  };
}
