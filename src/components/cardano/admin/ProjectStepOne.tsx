import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { useToast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import TransactionLoading from "../common/TransactionLoading";
import TransactionPlaceholderComponent from "~/components/placeholders/TransactionPlaceholderComponent";
import { useTreasury } from "~/hooks/db/contribution/useTreasury";

export default function ProjectStepOne({
  alias,
  setSuccessTxHash,
  treasuryId,
}: {
  alias: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
  treasuryId: string;
}) {
  const { toast } = useToast();

  const { wallet } = useWallet();
  const { updateTreasury, isUpdating } = useTreasury();
  // TODO: Implement multi alias - just needs to be sent from Parent + changed here
  const { data: builtTxResponse } =
    api.andamioAdminTransactions.initProjectStepOne.useQuery({
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
        updateTreasury({ id: treasuryId, treasuryNftPolicyId: builtTxResponse.projectNftPolicyId })
      }
    }
  }

  if (isUpdating) return "Updating Treasury in DB"

  return (
    <TransactionPlaceholderComponent name="StepOneMintCourseNft">
      {builtTxResponse ? (
        <>
          <Button onClick={onSubmit}>
            Project Instance Step 1: Initialize Project and Mint NFT
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
