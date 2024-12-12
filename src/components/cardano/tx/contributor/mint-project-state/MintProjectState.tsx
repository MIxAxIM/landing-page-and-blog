import { api } from "~/utils/api";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import { useWallet } from "@meshsdk/react";
import { useContributorPrerequisite } from "~/hooks/db/contribution/useContributorPrerequisite";
import TransactionCostDetails, { CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";

export default function MintProjectState({
  treasuryNftPolicyId,
  contributorPolicyId,
  setSuccessTxHash,
}: {
  treasuryNftPolicyId: string;
  contributorPolicyId: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { accessTokenAsset } = useAccessToken();
  const { wallet } = useWallet();
  const { prerequisiteByPolicyId } = useContributorPrerequisite({
    contributorPolicyId: contributorPolicyId,
  });


  const costBreakdown: CostBreakdown = {
    costDescriptions: [
      { txOutputIndexes: [0], description: "Cost Desc.", tooltipText: "Tooltip text" },
    ],
    andamioNetworkFee: 0,
  }

  const [formattedPrereqs, setFormattedPrereqs] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (prerequisiteByPolicyId) {
      const _formattedPrereqs = prerequisiteByPolicyId.courseRequirements.map(
        (cm) => [cm.course?.courseCreatorNFTPolicyID, cm.requiredModules],
      );
      setFormattedPrereqs(JSON.stringify(_formattedPrereqs));
    }
  }, [prerequisiteByPolicyId]);

  const { data: unsignedTxCBOR, error: txError } =
    api.contributorTransactions.mintProjectState.useQuery(
      {
        treasuryNftPolicyId: treasuryNftPolicyId ?? "",
        userAccessTokenUnit: accessTokenAsset?.unit ?? "",
        prerequisite: formattedPrereqs ?? "",
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
      <pre className="text-xs">
        Prerequisites:
        {JSON.stringify(prerequisiteByPolicyId, null, 2)}
      </pre>
      <TransactionCostDetails unsignedTxCBOR={unsignedTxCBOR?.unsignedTxCBOR ?? undefined} costBreakdown={costBreakdown} />

      <TransactionContainer
        buttonText={`Mint Project State`}
        unsignedTxCBOR={unsignedTxCBOR}
        wallet={wallet}
        setSuccessTxHash={setSuccessTxHash}
      />
    </div>
  );
}


