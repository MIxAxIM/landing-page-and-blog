import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { useToast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import TransactionLoading from "../TransactionLoading";
import TransactionPlaceholderComponent from "~/ui/prototype/TransactionPlaceholderComponent";
import { ContributorPrerequisite } from "~/types/db";
import { useTreasury } from "~/hooks/contribution/useTreasury";
import { useContributorPrerequisite } from "~/hooks/contribution/useContributorPrerequisite";

export default function ProjectStepFour({
  projectNftPolicyId,
  prerequisites,
  setSuccessTxHash,
  treasuryId
}: {
  projectNftPolicyId: string;
  prerequisites: ContributorPrerequisite;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
  treasuryId: string;
}) {
  const { toast } = useToast();

  const { wallet } = useWallet();
  const { updateTreasury, isUpdating } = useTreasury();
  const { updatePrerequisite } = useContributorPrerequisite({})

  const formattedPrereqs = prerequisites.courseRequirements.map(cm => [cm.course?.courseCreatorNFTPolicyID, cm.requiredModules])

  const { data: builtTxResponse } =
    api.andamioAdminTransactions.initProjectStepFour.useQuery({
      policy: projectNftPolicyId,
      prerequisite: JSON.stringify(formattedPrereqs),
    });

  // TODO: Get a contributorPolicyId from response of init-tx-4 (or elsewhere?), then fix updatePrerequiste with a custom method that just adds contributorPolicyId

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
        updateTreasury({ id: treasuryId, live: true })
        updatePrerequisite({ id: prerequisites.id, contributorPolicyId: "awaiting" })
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
          <pre>{JSON.stringify(formattedPrereqs)}</pre>
          <TransactionLoading wallet={wallet} />
        </div>
      )}
    </TransactionPlaceholderComponent>
  );
}
