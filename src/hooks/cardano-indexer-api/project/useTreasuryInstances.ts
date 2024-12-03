import { api } from "~/utils/api";

export default function useTreasuryInstances() {
  const {
    data: treasuryInstances,
    isLoading: isLoadingTreasuryInstances,
    isError: isErrorTreasuryInstances,
    error: errorTreasuryInstances,
  } = api.instanceValidator.getInstancesInfo.useQuery();
  return {
    treasuryInstances,
    isLoadingTreasuryInstances,
    isErrorTreasuryInstances,
    errorTreasuryInstances,
  }
}
