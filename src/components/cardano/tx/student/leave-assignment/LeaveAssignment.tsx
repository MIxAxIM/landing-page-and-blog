import { api } from "~/utils/api";
import { type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import { useWallet } from "@meshsdk/react";
import TransactionCostDetails, { type CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";
import { useAssignmentCommitment } from "~/hooks/db/course/useAssignmentCommitment";

export default function LeaveAssignment({
  assignmentCommitmentId,
  courseNftPolicyId,
  setSuccessTxHash,
}: {
  assignmentCommitmentId: string;
  courseNftPolicyId: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { accessTokenAsset } = useAccessToken();
  const { wallet } = useWallet();
  const { updateNetworkStatus } = useAssignmentCommitment({})

  const costBreakdown: CostBreakdown = {
    costDescriptions: [
      { txOutputIndexes: [0], description: "Cost Desc.", tooltipText: "Tooltip text" },
    ],
    andamioNetworkFee: 0,
  }

  const {
    data: unsignedTxCBOR,
    error: txError,
  } = api.studentTransactions.leaveAssignment.useQuery(
    {
      courseNftPolicyId: courseNftPolicyId ?? "",
      userAccessTokenUnit: accessTokenAsset?.unit ?? "",
    },
    {
      // Don't attempt the query if we don't have an alias
      enabled: !!courseNftPolicyId && !!accessTokenAsset,
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


  // callback for submitted transaction
  const handleStatusChange = async () => {
    updateNetworkStatus({
      id: assignmentCommitmentId,
      networkStatus: "PENDING_TX_LEAVE_ASSIGNMENT"
    })
  }

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
        buttonText={`Leave Assignment`}
        unsignedTxCBOR={unsignedTxCBOR}
        wallet={wallet}
        setSuccessTxHash={setSuccessTxHash}
        onTransactionSuccess={handleStatusChange}
      />
    </div>
  );
}
