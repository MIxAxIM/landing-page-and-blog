
import { api } from "~/utils/api";

export default function useEscrowDatum(treasuryNftPolicyId?: string, alias?: string) {
  const {
    data: decodedEscrowDatum,
    isLoading: isLoadingDecodedEscrowDatum,
    isError: isErrorDecodedEscrowDatum,
    error: errorDecodedEscrowDatum,
  } = api.escrowValidator.getEscrowDecodedDatumByTreasuryByAlias.useQuery(
    {
      policy: treasuryNftPolicyId ?? "",
      alias: alias ?? "",
    },
    {
      enabled: !!treasuryNftPolicyId && !!alias,
    });
  return {
    decodedEscrowDatum,
    isLoadingDecodedEscrowDatum,
    isErrorDecodedEscrowDatum,
    errorDecodedEscrowDatum,
  }
}
