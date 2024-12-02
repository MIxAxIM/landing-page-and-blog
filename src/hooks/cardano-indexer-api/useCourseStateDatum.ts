import { api } from "~/utils/api";

export default function useCourseStateDatum(
  courseNftPolicy: string,
  alias: string,
) {
  
  const {
    data: courseStateDatum,
    isLoading: isLoadingCourseStateDatum,
    isError: isErrorCourseStateDatum,
    error: errorCourseStateDatum,
  } = api.localStateValidator.getCourseStateDatumByAlias.useQuery({
    courseNftPolicy: courseNftPolicy,
    alias: alias,
  });

  return { courseStateDatum, isLoadingCourseStateDatum, isErrorCourseStateDatum, errorCourseStateDatum }
}
