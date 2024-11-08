import { api } from "~/utils/api";
import { type Treasury } from "~/types/db";

interface UseTreasuriesReturn {
  treasuries: Treasury[] | undefined;
  isLoadingTreasuries: boolean;
}

export default function useTreasuries(): UseTreasuriesReturn {
  const { data: treasuries, isLoading: isLoadingTreasuries } =
    api.treasury.getTreasuries.useQuery();

  return { treasuries, isLoadingTreasuries };
}
