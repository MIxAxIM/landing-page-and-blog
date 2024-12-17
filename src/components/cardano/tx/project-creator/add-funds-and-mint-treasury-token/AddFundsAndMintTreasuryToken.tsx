import { api } from "~/utils/api";
import { type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import { useWallet } from "@meshsdk/react";
import { useTask } from "~/hooks/db/contribution/useTask";
import TransactionCostDetails, { CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";

export default function AddFundsAndMintTreasuryToken({
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


  // Any tx will have a set of outputs.
  // Build a re-usable component where we can match a description to an output index -- this would be helpful for all transactions
  const costBreakdown: CostBreakdown = {
    costDescriptions: [
      { txOutputIndexes: [1], description: "Project Treasury State Token", tooltipText: "This is where project data is stored..." },
    ],
    andamioNetworkFee: 5000000, // How to incorporate network fee -> Dev team 2024-12-09
  }

  const {
    data: unsignedTxCBOR,
    isLoading,
    error: txError
  } = api.projectCreatorTransactions.mintProjectToken.useQuery(
    {
      userAccessTokenUnit: accessTokenAsset?.unit ?? "",
      treasuryNftPolicyId: treasuryNftPolicyId ?? "",
      allowedContributors: contributorsToAdd ?? [],
      projects: projects
    },
    {
      // Don't attempt the query without inputs
      enabled: !!accessTokenAsset && !!treasuryNftPolicyId && !!contributorsToAdd,
    }

  );

  const handleStatusChange = async () => {
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

  if (!wallet) return

  return (
    <div className="flex flex-col w-full mx-auto">
      <TransactionCostDetails unsignedTxCBOR={unsignedTxCBOR?.unsignedTxCBOR ?? undefined} costBreakdown={costBreakdown} />
      <TransactionContainer
        buttonText={`Mint Project Token`}
        unsignedTxCBOR={unsignedTxCBOR}
        wallet={wallet}
        setSuccessTxHash={setSuccessTxHash}
        onTransactionSuccess={handleStatusChange}
      />
    </div >
  );

}
