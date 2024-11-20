import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { useToast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import TransactionLoading from "../TransactionLoading";
import TransactionPlaceholderComponent from "~/ui/prototype/TransactionPlaceholderComponent";

export default function ProjectStepFour({
  projectNftPolicyId,
  prerequisites,
  setSuccessTxHash,
}: {
  projectNftPolicyId: string;
  prerequisites: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { toast } = useToast();

  const { wallet } = useWallet();

  const { data: builtTxResponse } =
    api.andamioAdminTransactions.initProjectStepFour.useQuery({
      policy: projectNftPolicyId,
      prerequisite: prerequisites,
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
    <TransactionPlaceholderComponent name="StepFourAddPrereqs">
      {builtTxResponse ? (
        <>
          <Button onClick={onSubmit}>
            Project Instance Step 4: Add Prereqs
          </Button>
          <pre>{builtTxResponse.projectNftPolicyId}</pre>
        </>
      ) : (
        <div className="flex flex-col">
          <TransactionLoading wallet={wallet} />
        </div>
      )}
    </TransactionPlaceholderComponent>
  );
}
