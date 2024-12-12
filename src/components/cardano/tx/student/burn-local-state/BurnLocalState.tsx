import { useWallet } from "@meshsdk/react";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import TransactionCostDetails, { CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";

export default function BurnLocalState({
  accessTokenAssetId,
  courseNftPolicyId,
  setSuccessTxHash,
}: {
  accessTokenAssetId: string;
  courseNftPolicyId: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { wallet } = useWallet();

  const costBreakdown: CostBreakdown = {
    costDescriptions: [
      { txOutputIndexes: [0], description: "Cost Desc.", tooltipText: "Tooltip text" },
    ],
    andamioNetworkFee: 0,
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
      />
    </div>
  );
}
