import { useWallet } from "@meshsdk/react";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import TransactionCostDetails, { CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";
import { useAssignmentCommitment } from "~/hooks/db/course/useAssignmentCommitment";

export default function BurnLocalState({
  learnerId,
  courseCode,
  accessTokenAssetId,
  courseNftPolicyId,
  setSuccessTxHash,
}: {
  learnerId: string;
  courseCode: string;
  accessTokenAssetId: string;
  courseNftPolicyId: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { wallet } = useWallet();
  const { claimCredentials } = useAssignmentCommitment({})

  const costBreakdown: CostBreakdown = {
    costDescriptions: [
      { txOutputIndexes: [0], description: "Cost Desc.", tooltipText: "Tooltip text" },
    ],
    andamioNetworkFee: 0,
  }

  const handleStatusChange = async () => {
    claimCredentials({
      learnerId: learnerId,
      courseCode: courseCode
    })
  }

  const { data: unsignedTxCBOR } =
    api.studentTransactions.burnLocalState.useQuery({
      userAccessTokenUnit: accessTokenAssetId,
      courseNftPolicyId: courseNftPolicyId,
    });

  return (
    <div className="flex flex-col w-full mx-auto">
      <TransactionCostDetails unsignedTxCBOR={unsignedTxCBOR?.unsignedTxCBOR ?? undefined} costBreakdown={costBreakdown} />
      <TransactionContainer
        buttonText={`Un-Enroll in Course`}
        unsignedTxCBOR={unsignedTxCBOR}
        wallet={wallet}
        setSuccessTxHash={setSuccessTxHash}
        onTransactionSuccess={handleStatusChange}
      />
    </div>
  );
}
