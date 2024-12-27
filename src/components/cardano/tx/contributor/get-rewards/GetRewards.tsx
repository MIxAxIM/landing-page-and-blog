import { api } from "~/utils/api";
import { type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import { useWallet } from "@meshsdk/react";
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment";
import TransactionCostDetails, { type CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";

export default function GetRewards({
  taskCommitmentId,
  treasuryNftPolicyId,
  setSuccessTxHash,
}: {
  taskCommitmentId: string;
  treasuryNftPolicyId: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { accessTokenAsset } = useAccessToken();
  const { wallet } = useWallet();

  const { updateTaskCommitmentStatus } = useTaskCommitment({})

  const costBreakdown: CostBreakdown = {
    costDescriptions: [
      { txInputIndexes: [0], txOutputIndexes: [], description: "You will receive", tooltipText: "Tooltip" },
      { txInputIndexes: [1], txOutputIndexes: [0], description: "Credential storage", tooltipText: "Tooltip" },
    ],
    andamioNetworkFee: 1500000, // How to incorporate network fee -> Dev team 2024-12-09
  }

  const {
    data: unsignedTxCBOR,
    error: txError,
  } = api.contributorTransactions.getRewards.useQuery(
    {
      treasuryNftPolicyId: treasuryNftPolicyId ?? "",
      userAccessTokenUnit: accessTokenAsset?.unit ?? "",
    },
    {
      // Don't attempt the query if we don't have an alias
      enabled: !!treasuryNftPolicyId && !!accessTokenAsset,
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
    },
  );


  const handleStatusChange = async () => {
    updateTaskCommitmentStatus({
      id: taskCommitmentId,
      status: "PENDING_TX_GET_REWARDS",
    });
  };

  if (txError) {
    return (
      <div className="mx-4 flex items-center justify-center rounded-md border px-4 py-3 font-mono text-sm">
        <h2>Transaction Error</h2>
        <p>{JSON.stringify(txError.message)}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full mx-auto">
      <TransactionCostDetails unsignedTxCBOR={unsignedTxCBOR?.unsignedTxCBOR ?? undefined} costBreakdown={costBreakdown} />
      <TransactionContainer
        buttonText={`Get Contribution Rewards`}
        unsignedTxCBOR={unsignedTxCBOR}
        wallet={wallet}
        setSuccessTxHash={setSuccessTxHash}
        onTransactionSuccess={handleStatusChange}
      />
    </div>
  );
}
