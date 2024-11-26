import { api } from "~/utils/api";
import { type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/transactions/TransactionContainer";
import { useAccessToken } from "~/hooks/onchain/useAccessToken";
import { useWallet } from "@meshsdk/react";

// TODO: Next step 2024-11-26 - complete this transaction with correct `projects` data being passed from parent form

// TODO: Use this Tx from app/projects/[treasury]/[escrow]

export default function MintProjectToken({
  treasuryNftPolicyId,
  contributorsToAdd,
  projects,
  setSuccessTxHash
}: {
  treasuryNftPolicyId?: string,
  contributorsToAdd?: string[],
  projects: string
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { accessTokenAlias, accessTokenAsset } = useAccessToken();
  const { wallet } = useWallet();

  const {
    data: unsignedTxCBOR,
    isLoading,
    error: txError
  } = api.projectManagerTransactions.mintProjectToken.useQuery(
    {
      userAccessTokenUnit: accessTokenAsset?.unit ?? "",
      treasuryNftPolicyId: treasuryNftPolicyId ?? "",
      allowedContributors: contributorsToAdd ?? [],
      projects: projects
    },
    {
      // Don't attempt the query if we don't have an alias
      enabled: !!accessTokenAsset && !!treasuryNftPolicyId && !!contributorsToAdd,
      // Don't retry on error since we expect some queries to fail
      retry: false,
    }
  );

  if (txError) {
    return (
      <div className="mx-4 flex items-center justify-center rounded-md border px-4 py-3 font-mono text-sm">
        <h2>Transaction Error</h2>
        <p>{txError.message}</p>
      </div>
    );
  }

  return (
    <TransactionContainer
      buttonText={`Mint Project Token`}
      unsignedTxCBOR={unsignedTxCBOR}
      wallet={wallet}
      setSuccessTxHash={setSuccessTxHash}
    />
  );

}
