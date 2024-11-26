import { api } from "~/utils/api";

export default function useProjectByTreasury(
  { treasuryNftPolicyId, alias }:
    { treasuryNftPolicyId?: string, alias?: string }
) {

  // TODO: 
  // 2. Add necessary data processing
  // 3. Use these hooks to implement tx4 in Task List View

  const {
    data: contributorStateUtxos,
    isLoading: isLoadingContributorStateUtxos,
    isError: isErrorContributorStateUtxos,
    error: errorContributorStateUtxos,
  } = api.projectValidators.getAllContributorStateUtxos.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "" },
    { enabled: !!treasuryNftPolicyId }
  );

  const {
    data: contributorStateUtxo,
    isLoading: isLoadingContributorStateUtxo,
    isError: isErrorContributorStateUtxo,
    error: errorContributorStateUtxo,
  } = api.projectValidators.getContributorStateUtxoByAlias.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "", alias: alias ?? "" },
    { enabled: !!treasuryNftPolicyId && !!alias }
  );

  const {
    data: contributorPolicies,
    isLoading: isLoadingContributorPolicies,
    isError: isErrorContributorPolicies,
    error: errorContributorPolicies,
  } = api.projectValidators.getContributorPolicies.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "" },
    { enabled: !!treasuryNftPolicyId }
  );

  const {
    data: escrowUtxos,
    isLoading: isLoadingEscrowUtxos,
    isError: isErrorEscrowUtxos,
    error: errorEscrowUtxos,
  } = api.projectValidators.getEscrowUtxosByTreasury.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "" },
    { enabled: !!treasuryNftPolicyId }
  );

  const {
    data: treasuryUtxos,
    isLoading: isLoadingTreasuryUtxos,
    isError: isErrorTreasuryUtxos,
    error: errorTreasuryUtxos,
  } = api.projectValidators.getAllUtxosByTreasury.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "" },
    { enabled: !!treasuryNftPolicyId }
  );

  const {
    data: treasuryInfo,
    isLoading: isLoadingTreasuryInfo,
    isError: isErrorTreasuryInfo,
    error: errorTreasuryInfo,
  } = api.projectValidators.getAllUtxosByTreasury.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "" },
    { enabled: !!treasuryNftPolicyId }
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

    treasuryUtxos,
    isLoadingTreasuryUtxos,
    isErrorTreasuryUtxos,
    errorTreasuryUtxos,

    treasuryInfo,
    isLoadingTreasuryInfo,
    isErrorTreasuryInfo,
    errorTreasuryInfo,
  }

}
