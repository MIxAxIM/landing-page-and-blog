import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { useToast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import TransactionLoading from "../common/TransactionLoading";
import TransactionPlaceholderComponent from "~/components/placeholders/TransactionPlaceholderComponent";

export default function StepOneMintCourseNft({
  alias,
  setSuccessTxHash,
}: {
  alias: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { toast } = useToast();

  const { wallet } = useWallet();

  const { data: builtTxResponse } =
    api.andamioAdminTransactions.initCourseStepOne.useQuery({
      aliases: [alias],
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
    <TransactionPlaceholderComponent name="StepOneMintCourseNft">
      {builtTxResponse ? (
        <>
          <Button onClick={onSubmit}>
            Course Instance Step 1: Mint Course NFT
          </Button>
          <p>This will mint a Course NFT with policy id:</p>
          <pre>{builtTxResponse.courseNftPolicyId}</pre>
          <p>Copy this Policy Id. You will use it in steps 2 and 3.</p>
        </>
      ) : (
        <div className="flex flex-col">
          <TransactionLoading wallet={wallet} />
        </div>
      )}
    </TransactionPlaceholderComponent>
  );
}
