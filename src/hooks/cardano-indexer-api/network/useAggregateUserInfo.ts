import { api } from "~/utils/api";
import { useAccessToken } from "./useAccessToken";

export default function useAggregateUserInfo() {
  const { accessTokenAlias } = useAccessToken()
  const {
    data: aggregateUserInfo,
    isLoading: isLoadingAggregateUserInfo,
    isError: isErrorAggregateUserInfo,
    error: errorAggregateUserInfo,
  } = api.aggregate.getUserInfo.useQuery({ alias: accessTokenAlias ?? "" }, { enabled: !!accessTokenAlias });

  return {
    aggregateUserInfo,
    isLoadingAggregateUserInfo,
    isErrorAggregateUserInfo,
    errorAggregateUserInfo,
  };
}
