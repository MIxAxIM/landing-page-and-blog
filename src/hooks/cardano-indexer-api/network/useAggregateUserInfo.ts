import { api } from "~/utils/api";

export default function useAggregateUserInfo(alias: string) {
  const {
    data: aggregateUserInfo,
    isLoading: isLoadingAggregateUserInfo,
    isError: isErrorAggregateUserInfo,
    error: errorAggregateUserInfo,
  } = api.aggregate.getUserInfo.useQuery({ alias }, { enabled: !!alias });

  return {
    aggregateUserInfo,
    isLoadingAggregateUserInfo,
    isErrorAggregateUserInfo,
    errorAggregateUserInfo,
  };
}
