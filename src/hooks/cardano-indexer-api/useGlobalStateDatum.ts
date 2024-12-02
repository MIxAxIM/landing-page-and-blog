import { api } from "~/utils/api";

export default function useGlobalStateDatum(alias: string) {
  const {
    data: globalStateDatum,
    isLoading: isLoadingGlobalStateDatum,
    isError: isErrorGlobalStateDatum,
    error: errorGlobalStateDatum,
  } = api.globalStateValidator.getGlobalStateDatumByAlias.useQuery({ alias }, { enabled: !!alias });

  return {
    globalStateDatum,
    isLoadingGlobalStateDatum,
    isErrorGlobalStateDatum,
    errorGlobalStateDatum,
  };
}
