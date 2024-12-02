import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { useToast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import TransactionPlaceholderComponent from "~/components/placeholders/TransactionPlaceholderComponent";
import TransactionLoading from "~/components/cardano/common/TransactionLoading";

export default function InitCourseStep3({
  policy,
  setSuccessTxHash,
}: {
  policy: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { toast } = useToast();

  const { wallet } = useWallet();

  const { data: builtTxResponse } =
    api.andamioAdminTransactions.initCourseStepThree.useQuery({
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
    <TransactionPlaceholderComponent name="StepThreeDeployCourseInstance">
      {builtTxResponse ? (
        <Button onClick={onSubmit}>
          Course Instance Step 3: Deploy Course
        </Button>
      ) : (
        <div className="flex flex-col">
          <TransactionLoading wallet={wallet} />
        </div>
      )}
    </TransactionPlaceholderComponent>
  );
}
