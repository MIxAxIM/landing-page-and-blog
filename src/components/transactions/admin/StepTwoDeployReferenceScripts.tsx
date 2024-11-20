import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { useToast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import TransactionLoading from "../TransactionLoading";
import TransactionPlaceholderComponent from "~/ui/prototype/TransactionPlaceholderComponent";

export default function StepTwoDeployReferenceScripts({
  policy,
  setSuccessTxHash,
}: {
  policy: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { toast } = useToast();

  const { wallet } = useWallet();

  const { data: builtTxResponse } =
    api.andamioAdminTransactions.initCourseStepTwo.useQuery({
      policy: policy,
    });

  async function onSubmit() {
    if (policy) {
      if (builtTxResponse) {
        const signedTx = await wallet.signTx(
          builtTxResponse.unsignedTxCBOR,
          true,
        );
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
  }

  return (
    <TransactionPlaceholderComponent name="StepTwoDeployReferenceScripts">
      {builtTxResponse ? (
        <Button onClick={onSubmit}>
          Course Instance Step 2: Deploy Reference Scripts
        </Button>
      ) : (
        <div className="flex flex-col">
          <TransactionLoading wallet={wallet} />
        </div>
      )}
    </TransactionPlaceholderComponent>
  );
}
