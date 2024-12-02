import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { useToast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import TransactionLoading from "~/components/cardano/common/TransactionLoading";

export default function AddCourseCreators({
  alias,
  policy,
  setSuccessTxHash,
}: {
  alias: string;
  policy: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { toast } = useToast();

  const { wallet } = useWallet();

  const { data: builtTxResponse } =
    api.andamioAdminTransactions.addCourseTeacher.useQuery({
      aliases: [alias],
      policy: policy,
    });

  async function onSubmit() {
    if (alias) {
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
    <div className="mx-4 flex flex-col items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm">
      {builtTxResponse ? (
        <>
          <Button onClick={onSubmit}>Add a Teacher to Course</Button>
          <p>You will add:</p>
          <pre>{alias}</pre>
          <p>To:</p>
          <pre>{policy}</pre>
        </>
      ) : (
        <div className="flex flex-col">
          <TransactionLoading wallet={wallet} />
        </div>
      )}
    </div>
  );
}
