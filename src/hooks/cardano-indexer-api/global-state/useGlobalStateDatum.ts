import { api } from "~/utils/api";

export default function useGlobalStateDatum(alias: string) {
  const {
    data: globalStateDatum,
    isLoading: isLoadingGlobalStateDatum,
    isError: isErrorGlobalStateDatum,
    error: errorGlobalStateDatum,
  } = api.globalState.getDecodedDatum.useQuery({ alias }, { enabled: !!alias });

  return {
    globalStateDatum,
    isLoadingGlobalStateDatum,
    isErrorGlobalStateDatum,
    errorGlobalStateDatum,
  };
}
