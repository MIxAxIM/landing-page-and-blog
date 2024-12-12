import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import TransactionCostDetails, { CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";

export default function AcceptDenyAssignment({
  courseNftPolicy,
  userAccessTokenUnit,
  studentAlias,
  decision,
  setSuccessTxHash,
}: {
  courseNftPolicy: string;
  userAccessTokenUnit: string;
  studentAlias: string;
  decision: "accept" | "deny";
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { wallet } = useWallet();

  const costBreakdown: CostBreakdown = {
    costDescriptions: [
      { txOutputIndexes: [0], description: "Cost Desc.", tooltipText: "Tooltip text" },
    ],
    andamioNetworkFee: 0,
  }

  const { data: unsignedTxCBOR, error: txError } =
    decision === "accept"
      ? api.courseCreatorTransactions.acceptAssignment.useQuery({
        userAccessTokenUnit: userAccessTokenUnit,
        courseNftPolicyId: courseNftPolicy,
        studentAlias: studentAlias,
      })
      : api.courseCreatorTransactions.denyAssignment.useQuery({
        userAccessTokenUnit: userAccessTokenUnit,
        courseNftPolicyId: courseNftPolicy,
        studentAlias: studentAlias,
      });

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
        buttonText={`${decision} assignment`}
        unsignedTxCBOR={unsignedTxCBOR}
        wallet={wallet}
        setSuccessTxHash={setSuccessTxHash}
      />
    </div>
  );
}
