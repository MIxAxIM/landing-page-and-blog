import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { useToast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import TransactionLoading from "../TransactionLoading";
import TransactionPlaceholderComponent from "~/ui/prototype/TransactionPlaceholderComponent";

export default function ProjectStepTwo({
  projectNftPolicyId,
  setSuccessTxHash,
}: {
  projectNftPolicyId: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { toast } = useToast();

  const { wallet } = useWallet();

  const { data: builtTxResponse } =
    api.andamioAdminTransactions.initProjectStepTwo.useQuery({
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
    <TransactionPlaceholderComponent name="InitProjectStepTwo">
      {builtTxResponse ? (
        <>
          <Button onClick={onSubmit}>
            Project Instance Step 2: Get Description
          </Button>
          <p>This will mint a Project NFT with policy id:</p>
          <pre>{builtTxResponse.projectNftPolicyId}</pre>
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
