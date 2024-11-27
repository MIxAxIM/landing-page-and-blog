import { api } from "~/utils/api";
import { type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/transactions/TransactionContainer";
import { useAddress, useWallet } from "@meshsdk/react";

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

  const {
    data: unsignedTxCBOR,
    isLoading,
    error: txError,
  } = api.projectManagerTransactions.addFunds.useQuery(
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

  return (
    <TransactionContainer
      buttonText={`Add Ada to Treasury`}
      unsignedTxCBOR={unsignedTxCBOR}
      wallet={wallet}
      setSuccessTxHash={setSuccessTxHash}
    />
  );
}
