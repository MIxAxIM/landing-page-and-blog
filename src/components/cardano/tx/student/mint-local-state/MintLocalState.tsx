import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import TransactionCostDetails, { CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";
import useCourseByPolicyId from "~/hooks/cardano-indexer-api/course/useCourseByPolicyId";
import { api } from "~/utils/api";

export default function MintLocalState({
  userAccessTokenUnit,
  courseNftPolicyId,
  setSuccessTxHash,
}: {
  userAccessTokenUnit: string;
  courseNftPolicyId: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { courseInfo } = useCourseByPolicyId(courseNftPolicyId);
  const { wallet } = useWallet();

  const costBreakdown: CostBreakdown = {
    costDescriptions: [
      { txOutputIndexes: [0], description: "Cost Desc.", tooltipText: "Tooltip text" },
    ],
    andamioNetworkFee: 0,
  }

  const { data: unsignedTxCBOR } =
    api.studentTransactions.mintLocalState.useQuery(
      {
        userAccessTokenUnit: userAccessTokenUnit,
        courseNftPolicyId: courseNftPolicyId,
      },
      {
        // Don't attempt the query if we don't have an alias
        enabled: !!courseInfo && !!userAccessTokenUnit,
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

  return (
    <div className="flex flex-col w-full mx-auto">
      <TransactionCostDetails unsignedTxCBOR={unsignedTxCBOR?.unsignedTxCBOR ?? undefined} costBreakdown={costBreakdown} />
      <TransactionContainer
        buttonText={`Enroll In ${courseInfo?.title}`}
        unsignedTxCBOR={unsignedTxCBOR}
        wallet={wallet}
        setSuccessTxHash={setSuccessTxHash}
      />
    </div>
  );
}
