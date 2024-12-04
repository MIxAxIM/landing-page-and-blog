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
  } = api.contributorState.getAllContributorStateUtxos.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "" },
    {
      enabled: !!treasuryNftPolicyId && treasuryNftPolicyId.length === 56,
      retry: false,
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
    }
  );

  const {
    data: contributorPolicies,
    isLoading: isLoadingContributorPolicies,
    isError: isErrorContributorPolicies,
    error: errorContributorPolicies,
  } = api.contributorState.getContributorPolicies.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId ?? "" },
    { enabled: !!treasuryNftPolicyId && treasuryNftPolicyId.length === 56 }
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
      retry: false,
    }
  );

  // NOTE: See comment in projectValidatorRouter
  //const {
  //  data: treasuryUtxos,
  //  isLoading: isLoadingTreasuryUtxos,
  //  isError: isErrorTreasuryUtxos,
  //  error: errorTreasuryUtxos,
  //} = api.projectValidators.getAllUtxosByTreasury.useQuery(
  //  { treasuryNftPolicyId: treasuryNftPolicyId ?? "" },
  //  { enabled: !!treasuryNftPolicyId }
  //);

  const {
    data: treasuryInfo,
    isLoading: isLoadingTreasuryInfo,
    isError: isErrorTreasuryInfo,
    error: errorTreasuryInfo,
  } = api.treasuryValidator.getTreasuryInfo.useQuery(
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

    //treasuryUtxos,
    //isLoadingTreasuryUtxos,
    //isErrorTreasuryUtxos,
    //errorTreasuryUtxos,

    treasuryInfo,
    isLoadingTreasuryInfo,
    isErrorTreasuryInfo,
    errorTreasuryInfo,
  }

}
