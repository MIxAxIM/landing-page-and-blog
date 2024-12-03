import { api } from "~/utils/api";
import { useAccessToken } from "../network/useAccessToken";

export default function useNetworkLearner({ courseNftPolicyId }: { courseNftPolicyId?: string }) {
  const { accessTokenAlias } = useAccessToken();

  const {
    data: courseStateDatum,
    isLoading: isLoadingCourseStateDatum,
  } = api.courseState.getCourseStateDatumByAlias.useQuery(
    {
      courseNftPolicy: courseNftPolicyId ?? "",
      alias: accessTokenAlias ?? ""
    },
    {
      // Don't attempt the query if we don't have an alias
      enabled: !!accessTokenAlias && !!courseNftPolicyId,
      // Don't retry on error since we expect some queries to fail
      retry: false,
    }
  );

  return {
    isEnrolled: !!courseStateDatum,
    courseStateDatum,
    isLoadingCourseStateDatum,
  };
}
