import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment";
import TransactionCostDetails, { CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";

export default function DenyProject({
  taskCommitmentId,
  treasuryNftPolicyId,
  userAccessTokenUnit,
  contributorAlias,
  setSuccessTxHash,
}: {
  taskCommitmentId: string;
  treasuryNftPolicyId: string;
  userAccessTokenUnit: string;
  contributorAlias: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { wallet } = useWallet();

  const { updateTaskCommitmentStatus, taskCommitment } = useTaskCommitment({ id: taskCommitmentId });

  // Any tx will have a set of outputs.
  // Build a re-usable component where we can match a description to an output index -- this would be helpful for all transactions
  const costBreakdown: CostBreakdown = {
    costDescriptions: [
      { txOutputIndexes: [0], description: "About this tx cost", tooltipText: "Tooltip text" },
    ],
    andamioNetworkFee: 0, // How to incorporate network fee -> Dev team 2024-12-09
  }

  const { data: unsignedTxCBOR, error: txError } = api.projectCreatorTransactions.denyProject.useQuery({
    userAccessTokenUnit: userAccessTokenUnit,
    contributorAlias: contributorAlias,
    treasuryNftPolicyId: treasuryNftPolicyId,
  })

  // TODO: implement polling to update from PENDING_TX_COMMITMENT_DENIED to COMMITMENT_DENIED
  const handleStatusChange = async () => {
    updateTaskCommitmentStatus({
      id: taskCommitmentId,
      status: "PENDING_TX_COMMITMENT_DENIED",
    });
  }

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
        buttonText={`deny that contribution is complete`}
        unsignedTxCBOR={unsignedTxCBOR}
        wallet={wallet}
        setSuccessTxHash={setSuccessTxHash}
        onTransactionSuccess={handleStatusChange}
      />
    </div>
  );
}
