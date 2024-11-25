import { api } from "~/utils/api";
import { type Treasury } from "~/types/db";
import { useEffect, useState } from "react";

interface UseTreasuriesReturn {
  treasuries: Treasury[] | undefined;
  treasuriesWithPolicyId: Treasury[] | undefined;
  isLoadingTreasuries: boolean;
}

export default function useTreasuries(disabled?: boolean): UseTreasuriesReturn {
  const [treasuriesWithPolicyId, setTreasuriesWithPolicyId] = useState<Treasury[] | undefined>(undefined)

  const { data: treasuries, isLoading: isLoadingTreasuries } =
    api.treasury.getTreasuries.useQuery(undefined, { enabled: !disabled });

  useEffect(() => {
    if (treasuries) {
      const _t = treasuries.filter(t => !!t.treasuryNftPolicyId)
      if (_t.length > 0) {
        setTreasuriesWithPolicyId(_t)
      }
    }
  }, [treasuries])

  return { treasuries, isLoadingTreasuries, treasuriesWithPolicyId };
}
