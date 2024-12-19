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

  const { data: qualifiedTreasuryNftPolicyIds } = api.aggregate.getQualifiedTreasuries.useQuery({ alias: accessTokenAlias ?? "" }, { enabled: !!accessTokenAlias });

  return {
    aggregateUserInfo,
    qualifiedTreasuryNftPolicyIds,
    isLoadingAggregateUserInfo,
    isErrorAggregateUserInfo,
    errorAggregateUserInfo,
  };
}
