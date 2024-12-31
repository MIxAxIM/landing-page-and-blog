import { api } from "~/utils/api";

export default function useProjectByTreasury(
  { treasuryNftPolicyId, alias }:
    { treasuryNftPolicyId?: string, alias?: string }
) {

  const {
    data: contributorStateUtxos,
    isLoading: isLoadingContributorStateUtxos,
    isError: isErrorContributorStateUtxos,
    error: errorContributorStateUtxos,
  } = api.contributorState.getAllContributorStateUtxos.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "" },
    {
      enabled: !!treasuryNftPolicyId && treasuryNftPolicyId.length === 56,
      retry: false,
      onError: (error) => {
        console.error('getAllContributorStateUtxos error:', error);
      },
    }
  );

  const {
    data: contributorStateUtxo,
    isLoading: isLoadingContributorStateUtxo,
    isError: isErrorContributorStateUtxo,
    error: errorContributorStateUtxo,
  } = api.contributorState.getContributorStateUtxoByAlias.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "", alias: alias ?? "" },
    {
      enabled: !!treasuryNftPolicyId && treasuryNftPolicyId.length === 56 && !!alias,
      retry: false,
      onError: (error) => {
        console.error('getContributorStateUtxoByAlias error:', error);
      },
    }
  );

  const {
    data: contributorPolicies,
    isLoading: isLoadingContributorPolicies,
    isError: isErrorContributorPolicies,
    error: errorContributorPolicies,
  } = api.contributorState.getContributorPolicies.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "" },
    {
      enabled: !!treasuryNftPolicyId && treasuryNftPolicyId.length === 56,
      onError: (error) => {
        console.error('getContributorPolicies error:', error);
      },

    }
  );

  const {
    data: escrowUtxos,
    isLoading: isLoadingEscrowUtxos,
    isError: isErrorEscrowUtxos,
    error: errorEscrowUtxos,
  } = api.escrowValidator.getAllEscrowUtxosByTreasury.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "" },
    {
      enabled: !!treasuryNftPolicyId && treasuryNftPolicyId.length === 56,
      refetchInterval: 60000,
      refetchOnMount: true,
      retry: false,
      onError: (error) => {
        console.error('getAllEscrowUtxosByTreasury error:', error);
      },
    }
  );

  const {
    data: treasuryInfo,
    isLoading: isLoadingTreasuryInfo,
    isError: isErrorTreasuryInfo,
    error: errorTreasuryInfo,
  } = api.treasuryValidator.getTreasuryInfo.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "" },
    {
      enabled: !!treasuryNftPolicyId && treasuryNftPolicyId.length === 56,
      refetchInterval: 60000,
      refetchOnMount: true,
      onError: (error) => {
        console.error('getTreasuryInfo error:', error);
      },
    }
  );

  const {
    data: hasProjectToken,
  } = api.treasuryValidator.checkProjectToken.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "" },
    { enabled: !!treasuryNftPolicyId && treasuryNftPolicyId.length === 56 }
  );

  return {
    contributorStateUtxos,
    isLoadingContributorStateUtxos,
    isErrorContributorStateUtxos,
    errorContributorStateUtxos,

    contributorStateUtxo,
    isLoadingContributorStateUtxo,
    isErrorContributorStateUtxo,
    errorContributorStateUtxo,

    contributorPolicies,
    isLoadingContributorPolicies,
    isErrorContributorPolicies,
    errorContributorPolicies,

    escrowUtxos,
    isLoadingEscrowUtxos,
    isErrorEscrowUtxos,
    errorEscrowUtxos,

    treasuryInfo,
    isLoadingTreasuryInfo,
    isErrorTreasuryInfo,
    errorTreasuryInfo,

    hasProjectToken,
  }

}
