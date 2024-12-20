import { api } from "~/utils/api";
import { type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import { useWallet } from "@meshsdk/react";
import TransactionCostDetails, { CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment";

export default function CommitProject({
  taskCommitmentId,
  treasuryNftPolicyId,
  project,
  info,
  successTxHash,
  setSuccessTxHash,
}: {
  taskCommitmentId?: string;
  treasuryNftPolicyId: string;
  project: string;
  info?: string;
  successTxHash: string | undefined;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { accessTokenAsset } = useAccessToken();
  const { wallet } = useWallet();

  const { updateTaskCommitmentStatus } = useTaskCommitment({})

  // Any tx will have a set of outputs.
  // Build a re-usable component where we can match a description to an output index -- this would be helpful for all transactions
  const costBreakdown: CostBreakdown = {
    costDescriptions: [
      { fixedAmount: 2000000, txOutputIndexes: [], description: "Deposit (will be returned)", tooltipText: "Tooltip" },
    ],
    andamioNetworkFee: 0, // How to incorporate network fee -> Dev team 2024-12-09
  }

  console.log("accessTokenAsset", accessTokenAsset);


  const {
    data: unsignedTxCBOR,
    isLoading,
    error: txError,
  } = api.contributorTransactions.commitProject.useQuery(
    {
      treasuryNftPolicyId: treasuryNftPolicyId,
      info: info ?? "",
      userAccessTokenUnit: accessTokenAsset?.unit ?? "",
      project: project,
    },
    {
      // Don't attempt the query if we don't have an alias
      enabled: !!treasuryNftPolicyId && !!accessTokenAsset && !!project && !successTxHash,
      // Don't retry on error since we expect some queries to fail
      retry: (failureCount, error) => {
        // Only retry up to 3 times
        if (failureCount >= 3) return false;

        // Don't retry on certain errors (you can customize this based on your API's error patterns)
        if (error instanceof Error) {
          const skipRetryMessages = [
            "Invalid parameters",
            "Unauthorized",
            // Add other error messages that shouldn't trigger retries
          ];
          if (skipRetryMessages.some(msg => error.message.includes(msg))) {
            return false;
          }
        }

        return true;
      },
      retryDelay: (failureCount) => {
        // Exponential backoff: 1s, 2s, 4s
        return Math.min(1000 * (2 ** (failureCount - 1)), 4000);
      },
      // Cache the successful result to prevent unnecessary refetches
      cacheTime: Infinity,
      staleTime: Infinity,
      // Don't refetch on window focus since this is a transaction preparation
      refetchOnWindowFocus: false
    }
  );

  const handleStatusChange = async () => {
    if (!!info && !!taskCommitmentId) {
      updateTaskCommitmentStatus({
        id: taskCommitmentId,
        status: "PENDING_TX_ADD_INFO",
      })
    } else if (!info && !!taskCommitmentId) {
      updateTaskCommitmentStatus({
        id: taskCommitmentId,
        status: "PENDING_TX_COMMITMENT_MADE",
      })
    }
  };

  if (txError) {
    return (
      <div className="mx-4 flex items-center justify-center rounded-md border px-4 py-3 font-mono text-sm">
        <h2>Transaction Error</h2>
        <p>{txError.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full mx-auto">
      <TransactionCostDetails unsignedTxCBOR={unsignedTxCBOR?.unsignedTxCBOR ?? undefined} costBreakdown={costBreakdown} />
      <TransactionContainer
        buttonText={`Commit To Project`}
        unsignedTxCBOR={unsignedTxCBOR}
        wallet={wallet}
        setSuccessTxHash={setSuccessTxHash}
        onTransactionSuccess={handleStatusChange}
      />
    </div >
  );
}
