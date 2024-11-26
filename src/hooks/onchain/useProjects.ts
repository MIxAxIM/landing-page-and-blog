import { api } from "~/utils/api";

export default function useProjectByTreasury(
  { treasuryNftPolicyId, alias }:
    { treasuryNftPolicyId: string, alias?: string }
) {

  // given a Treasury NFT Policy Id,
  // this hook returns
  // A list of Contributor State UTxOs
  // Valid Policies for new Contributors
  // Escrow UTxOs
  // Treasury UTxOs - with room to implement new features on /treasury/utxos
  // Treasury Info
  //
  // Then we can use all of that data throughout the app
  //
  //
  // TODO: 
  // 1. Add queries
  // 2. Add necessary data processing
  // 3. Use these hooks to implement tx4 in Task List View


  const {
    data: contributorStateUtxos,
    isLoading: isLoadingContributorStateUtxos,
    isError: isErrorContributorStateUtxos,
    error: errorContributorStateUtxos,
  } = api.projectValidators.getAllContributorStateUtxos.useQuery(
    { treasuryNftPolicyId },
    { enabled: !!treasuryNftPolicyId }
  );

  const {
    data: contributorStateUtxo,
    isLoading: isLoadingContributorStateUtxo,
    isError: isErrorContributorStateUtxo,
    error: errorContributorStateUtxo,
  } = api.projectValidators.getContributorStateUtxoByAlias.useQuery(
    { treasuryNftPolicyId, alias: alias ?? "" },
    { enabled: !!treasuryNftPolicyId && !!alias }
  );

  const {
    data: contributorPolicies,
    isLoading: isLoadingContributorPolicies,
    isError: isErrorContributorPolicies,
    error: errorContributorPolicies,
  } = api.projectValidators.getContributorPolicies.useQuery(
    { treasuryNftPolicyId },
    { enabled: !!treasuryNftPolicyId }
  );

  const {
    data: escrowUtxos,
    isLoading: isLoadingEscrowUtxos,
    isError: isErrorEscrowUtxos,
    error: errorEscrowUtxos,
  } = api.projectValidators.getEscrowUtxosByTreasury.useQuery(
    { treasuryNftPolicyId },
    { enabled: !!treasuryNftPolicyId }
  );

  const {
    data: treasuryUtxos,
    isLoading: isLoadingTreasuryUtxos,
    isError: isErrorTreasuryUtxos,
    error: errorTreasuryUtxos,
  } = api.projectValidators.getAllUtxosByTreasury.useQuery(
    { treasuryNftPolicyId },
    { enabled: !!treasuryNftPolicyId }
  );

  const {
    data: treasuryInfo,
    isLoading: isLoadingTreasuryInfo,
    isError: isErrorTreasuryInfo,
    error: errorTreasuryInfo,
  } = api.projectValidators.getAllUtxosByTreasury.useQuery(
    { treasuryNftPolicyId },
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
