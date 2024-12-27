import { api } from "~/utils/api";
import { type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { useAddress, useWallet } from "@meshsdk/react";
import TransactionCostDetails, { type CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";
import LoadingCircle from "~/components/editor/ContentEditor/ui/icons/loading-circle";

export default function AddFunds({
  treasuryNftPolicyId,
  adaAmount,
  setSuccessTxHash,
}: {
  treasuryNftPolicyId: string;
  adaAmount: number;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const address = useAddress();
  const { wallet } = useWallet();

  const costBreakdown: CostBreakdown = {
    costDescriptions: [
      { txOutputIndexes: [0], description: "To deposit in Treasury", tooltipText: "These funds will be used for tasks in this Project" },
    ],
    andamioNetworkFee: 0, // How to incorporate network fee -> Dev team 2024-12-09
  }

  const {
    data: unsignedTxCBOR,
    isLoading,
    error: txError,
  } = api.projectCreatorTransactions.addFunds.useQuery(
    {
      treasuryNftPolicyId: treasuryNftPolicyId,
      dipositorsAddress: address ?? "",
      adaAmount: adaAmount,
    },
    {
      // Don't attempt the query if we don't have an alias
      enabled: !!treasuryNftPolicyId && !!address,
      // Don't retry on error since we expect some queries to fail
      retry: false,
    },
  );

  if (txError) {
    return (
      <div className="mx-4 flex items-center justify-center rounded-md border px-4 py-3 font-mono text-sm">
        <h2>Transaction Error</h2>
        <p>{txError.message}</p>
      </div>
    );
  }

  if (isLoading) return <LoadingCircle />

  return (
    <div className="flex flex-col w-full mx-auto">
      <TransactionCostDetails unsignedTxCBOR={unsignedTxCBOR?.unsignedTxCBOR ?? undefined} costBreakdown={costBreakdown} />
      <TransactionContainer
        buttonText={`Add Ada to Treasury`}
        unsignedTxCBOR={unsignedTxCBOR}
        wallet={wallet}
        setSuccessTxHash={setSuccessTxHash}
      />
    </div >
  );
}
