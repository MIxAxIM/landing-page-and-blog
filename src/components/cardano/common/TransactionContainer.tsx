import { Button } from "~/components/ui/button";
import TransactionLoading from "./TransactionLoading";
import { useToast } from "~/components/ui/use-toast";
import { type Dispatch, type SetStateAction } from "react";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { IWallet } from "@meshsdk/common";

// Define a generic type for the callback parameters
type TransactionCallback<T = void> = (txId: string, params?: T) => Promise<void> | void;

interface TransactionContainerProps<T = void> {
  buttonText: string;
  unsignedTxCBOR: { unsignedTxCBOR: string } | undefined;
  wallet: IWallet;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
  onTransactionSuccess?: TransactionCallback<T>; // optional callback function
  callbackParams?: T; // optional callback parameters
}

export default function TransactionContainer<T = void>({
  buttonText,
  unsignedTxCBOR,
  wallet,
  setSuccessTxHash,
  onTransactionSuccess,
  callbackParams,
}: TransactionContainerProps<T>) {
  const { toast } = useToast();
  const { connected } = useWallet();


  async function onSubmit() {
    if (unsignedTxCBOR) {
      try {
        const signedTx = await wallet.signTx(unsignedTxCBOR.unsignedTxCBOR, true);
        const txId = await wallet.submitTx(signedTx);

        setSuccessTxHash(txId);
        toast({
          title: "Transaction submitted",
          description: `${txId}`,
        });

        // If the callback function is passed, it is called in the onSubmit function
        // Call the callback with both txId and additional params if they exist
        if (onTransactionSuccess) {
          if (callbackParams !== undefined) {
            await onTransactionSuccess(txId, callbackParams);
          } else {
            await onTransactionSuccess(txId);
          }
        }
      } catch (error) {
        toast({
          title: "Transaction failed",
          description: error instanceof Error ? error.message : "Unknown error occurred",
          variant: "destructive",
        });
      }
    }
  }

  if (!connected) {
    return <CardanoWallet />;
  }

  // A button appears when a valid tx is returned aby the Andamio API. 
  // The onSubmit function is called when user with connected waller clicks the button

  // Otherwise, the TransactionLoading component is shown (this component can be improved)
  return (
    <div className="mx-4 flex items-center justify-center rounded-md border px-4 py-3 font-mono text-sm">
      {unsignedTxCBOR ? (
        <Button onClick={onSubmit}>{buttonText}</Button>
      ) : (
        <div className="flex w-full flex-col">
          <TransactionLoading wallet={wallet} />
        </div>
      )}
    </div>
  );
}
