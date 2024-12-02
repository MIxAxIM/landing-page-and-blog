import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { useToast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import TransactionLoading from "../common/TransactionLoading";
import TransactionPlaceholderComponent from "~/components/placeholders/TransactionPlaceholderComponent";

export default function ProjectStepThree({
  projectNftPolicyId,
  setSuccessTxHash,
}: {
  projectNftPolicyId: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { toast } = useToast();

  const { wallet } = useWallet();

  const { data: builtTxResponse } =
    api.andamioAdminTransactions.initProjectStepThree.useQuery({
      policy: projectNftPolicyId
    });

  async function onSubmit() {
    if (projectNftPolicyId) {
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
    <TransactionPlaceholderComponent name="StepThreeMintCourseNft">
      {builtTxResponse ? (
        <>
          <Button onClick={onSubmit}>
            Project Instance Step 3: Initialize Project and Mint NFT
          </Button>
          <pre>{builtTxResponse.projectNftPolicyId}</pre>
          <p>You just used this Policy Id in Steps 2 and 3</p>
        </>
      ) : (
        <div className="flex flex-col">
          <TransactionLoading wallet={wallet} />
        </div>
      )}
    </TransactionPlaceholderComponent>
  );
}
