import { type BrowserWallet } from "@meshsdk/wallet";
import { Button } from "~/components/ui/button";
import TransactionLoading from "./TransactionLoading";
import { useToast } from "~/components/ui/use-toast";
import { type Dispatch, type SetStateAction } from "react";
import { CardanoWallet, useWallet } from "@meshsdk/react";

export default function TransactionContainer({
  buttonText,
  unsignedTxCBOR,
  wallet,
  setSuccessTxHash,
}: {
  buttonText: string;
  unsignedTxCBOR: { unsignedTxCBOR: string } | undefined;
  wallet: BrowserWallet;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { toast } = useToast();
  const { connected } = useWallet()

  async function onSubmit() {
    if (unsignedTxCBOR) {
      const signedTx = await wallet.signTx(unsignedTxCBOR.unsignedTxCBOR, true);
      console.log(signedTx);
      const txId = await wallet.submitTx(signedTx);
      console.log(txId);
      toast({
        title: "Transaction submitted",
        description: `${txId}`,
      });
      setSuccessTxHash(txId);
    }
  }

  if (!connected) {
    return <CardanoWallet />
  }

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
