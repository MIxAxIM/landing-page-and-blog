import { api } from "~/utils/api";
import { type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import { useWallet } from "@meshsdk/react";
import { useTask } from "~/hooks/db/contribution/useTask";
import TransactionCostDetails, { CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";

export default function ManageTreasuryToken({
  treasuryNftPolicyId,
  contributorsToAdd,
  projects,
  taskIds,
  setSuccessTxHash
}: {
  treasuryNftPolicyId?: string;
  contributorsToAdd?: string[];
  projects: string;
  taskIds: string[];
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { accessTokenAsset } = useAccessToken();
  const { wallet } = useWallet();
  const { updateTaskStatuses } = useTask({ treasuryNftPolicyId })

  const costBreakdown: CostBreakdown = {
    costDescriptions: [
      { txInputIndexes: [0], txOutputIndexes: [0], description: "Updated Min UTxO", tooltipText: "When you add more tasks to a Treasury, the utxo might need a bit more lovelace" },
    ],
    andamioNetworkFee: 0, // How to incorporate network fee -> Dev team 2024-12-09
  }

  const {
    data: unsignedTxCBOR,
    isLoading,
    error: txError
  } = api.projectCreatorTransactions.manageTreasuryToken.useQuery(
    {
      userAccessTokenUnit: accessTokenAsset?.unit ?? "",
      treasuryNftPolicyId: treasuryNftPolicyId ?? "",
      allowedContributors: contributorsToAdd ?? [],
      projects: projects
    },
    {
      // Don't attempt the query without inputs
      enabled: !!accessTokenAsset && !!treasuryNftPolicyId && !!contributorsToAdd,
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

  const handleStatusChange = () => {
    updateTaskStatuses({
      taskIds: taskIds,
      status: "PENDING_TX",
    });
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
      {!!unsignedTxCBOR && (
        <TransactionCostDetails unsignedTxCBOR={unsignedTxCBOR.unsignedTxCBOR} costBreakdown={costBreakdown} />
      )}
      <TransactionContainer
        buttonText={`Manage Treasury Token`}
        unsignedTxCBOR={unsignedTxCBOR}
        wallet={wallet}
        setSuccessTxHash={setSuccessTxHash}
        onTransactionSuccess={handleStatusChange}
      />
    </div >
  );


}
