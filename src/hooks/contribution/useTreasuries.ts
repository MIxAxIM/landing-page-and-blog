import { api } from "~/utils/api";
import { type Treasury } from "~/types/db";

interface UseTreasuriesReturn {
  treasuries: Treasury[] | undefined;
  isLoadingTreasuries: boolean;
}

export default function useTreasuries(disabled?: boolean): UseTreasuriesReturn {
  const { data: treasuries, isLoading: isLoadingTreasuries } =
    api.treasury.getTreasuries.useQuery(undefined, { enabled: !disabled });

  return { treasuries, isLoadingTreasuries };
}
