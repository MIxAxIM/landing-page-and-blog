import { CardanoWallet, useWallet } from "@meshsdk/react";
import { useState } from "react";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import { api } from "~/utils/api";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import SuccessTxModalContent from "~/components/cardano/common/SuccessTxComponent";
import TransactionCostDetails, { CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";
import { useAssignmentCommitment } from "~/hooks/db/course/useAssignmentCommitment";

export default function CommitToAssignment({
  courseCode,
  assignmentCode,
  assignmentCommitmentId,
  isCommitted,
  networkEvidenceHash,
}: {
  courseCode: string;
  assignmentCode: string;
  assignmentCommitmentId: string;
  isCommitted: boolean;
  networkEvidenceHash?: string;
}) {
  const { connected } = useWallet();
  const { accessTokenAsset } = useAccessToken();

  // TODO: 2024-12-17
  const courseNftPolicyId = false

  if (!courseNftPolicyId) return "This course is not published on the Andamio Network"

  return (
    <div className="flex w-full items-center justify-center rounded-md border py-3 font-mono text-sm">
      {!connected && (
        <CardanoWallet />
      )}
      {isCommitted && (
        <p>You are already committed to this assignment</p>
      )}

      {!!accessTokenAsset && (
        <>
          <CommitToAssignmentButton
            userAccessTokenUnit={accessTokenAsset.unit}
            courseNftPolicyId={""}
            assignmentCommitmentId={assignmentCommitmentId}
            assignmentCode={assignmentCode}
            networkEvidenceHash={networkEvidenceHash ?? "Assignment evidence will be submitted later"}
          />
        </>
      )}
    </div>
  );
}

export function CommitToAssignmentButton({
  userAccessTokenUnit,
  courseNftPolicyId,
  assignmentCommitmentId,
  assignmentCode,
  networkEvidenceHash,
}: {
  userAccessTokenUnit: string;
  courseNftPolicyId: string;
  assignmentCommitmentId: string;
  assignmentCode: string;
  networkEvidenceHash: string;
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
    api.studentTransactions.commitToAssignment.useQuery({
      userAccessTokenUnit: userAccessTokenUnit,
      courseNftPolicyId: courseNftPolicyId,
      assignmentCode: assignmentCode,
      assignmentInfo: networkEvidenceHash,
    });

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
