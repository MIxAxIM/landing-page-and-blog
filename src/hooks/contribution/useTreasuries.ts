import { api } from "~/utils/api";
import { type Treasury } from "~/types/db";
import { useEffect, useState } from "react";

interface UseTreasuriesReturn {
  treasuries: Treasury[] | undefined;
  treasuriesWithPolicyId: Treasury[] | undefined;
  publishedTreasuries: Treasury[] | undefined;
  isLoadingTreasuries: boolean;
}

export default function useTreasuries(disabled?: boolean): UseTreasuriesReturn {
  const [treasuriesWithPolicyId, setTreasuriesWithPolicyId] = useState<Treasury[] | undefined>(undefined)
  const [publishedTreasuries, setPublishedTreasuries] = useState<Treasury[] | undefined>(undefined)

  const { data: treasuries, isLoading: isLoadingTreasuries } =
    api.treasury.getTreasuries.useQuery(undefined, { enabled: !disabled });

  useEffect(() => {
    if (treasuries) {
      const _t = treasuries.filter(t => !!t.treasuryNftPolicyId)
      if (_t.length > 0) {
        setTreasuriesWithPolicyId(_t)
      }
      const _u = treasuries.filter(t => !!t.live)
      if (_u.length > 0) {
        setPublishedTreasuries(_u)
      }
    }
  }, [treasuries])

  return { treasuries, isLoadingTreasuries, treasuriesWithPolicyId, publishedTreasuries };
}
