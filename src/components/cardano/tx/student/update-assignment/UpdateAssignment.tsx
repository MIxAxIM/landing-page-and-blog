import { CardanoWallet, useWallet } from "@meshsdk/react";
import { useState } from "react";
import { NETWORK } from "~/andamio.config";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import { api } from "~/utils/api";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import SuccessTxModalContent from "~/components/cardano/common/SuccessTxComponent";
import TransactionCostDetails, { CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";
import { useAssignmentCommitment } from "~/hooks/db/course/useAssignmentCommitment";

export default function UpdateAssignment({
  assignmentCommitmentId,
  courseCode,
  evidenceHash,
}: {
  assignmentCommitmentId: string;
  courseCode: string;
  evidenceHash: string;
}) {
  const { connected } = useWallet();
  const { accessTokenAsset } = useAccessToken();

  const courseNftPolicyId = ""

  return (
    <div className="flex w-full items-center justify-center rounded-md border py-3 font-mono text-sm">
      {!connected && (
        <CardanoWallet />
      )}
      {connected && evidenceHash && !!accessTokenAsset && (
        <UpdateAssignmentButton
          assignmentCommitmentId={assignmentCommitmentId}
          userAccessTokenUnit={accessTokenAsset.unit}
          courseNftPolicyId={courseNftPolicyId}
          evidenceHash={evidenceHash}
        />

      )}
    </div>
  );
}

export function UpdateAssignmentButton({
  assignmentCommitmentId,
  userAccessTokenUnit,
  courseNftPolicyId,
  evidenceHash,
}: {
  assignmentCommitmentId: string;
  userAccessTokenUnit: string;
  courseNftPolicyId: string;
  evidenceHash: string;
}) {
  const { wallet } = useWallet();
  const { updateNetworkStatus } = useAssignmentCommitment({})


  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const costBreakdown: CostBreakdown = {
    costDescriptions: [
      { txOutputIndexes: [0], description: "Cost Desc.", tooltipText: "Tooltip text" },
    ],
    andamioNetworkFee: 0,
  }
  const { data: unsignedTxCBOR } =
    api.studentTransactions.updateAssignment.useQuery({
      userAccessTokenUnit: userAccessTokenUnit,
      courseNftPolicyId: courseNftPolicyId,
      assignmentInfo: evidenceHash,
    });

  // callback for submitted transaction
  const handleStatusChange = async () => {
    updateNetworkStatus({
      id: assignmentCommitmentId,
      networkStatus: "PENDING_TX_ADD_INFO"
    })
  }


  if (!!successTxHash) {
    return (
      <SuccessTxModalContent
        txName="Committed to Assignment"
        txHash={successTxHash}
        nextStepLinks={[]}
      />
    );
  }

  return (
    <div className="flex flex-col w-full mx-auto">
      <TransactionCostDetails unsignedTxCBOR={unsignedTxCBOR?.unsignedTxCBOR ?? undefined} costBreakdown={costBreakdown} />
      <TransactionContainer
        buttonText={`Commit to Assignment`}
        unsignedTxCBOR={unsignedTxCBOR}
        wallet={wallet}
        setSuccessTxHash={setSuccessTxHash}
        onTransactionSuccess={handleStatusChange}
      />
    </div>
  );
}
