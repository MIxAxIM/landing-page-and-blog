import { api } from "~/utils/api";

export default function useTreasuries() {
  const { data: treasuries, isLoading: isLoadingTreasuries } =
    api.treasury.getTreasuries.useQuery();

  return { treasuries, isLoadingTreasuries };
}
