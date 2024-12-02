import { api } from "~/utils/api";
import { type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/cardano/TransactionContainer";
import { useAccessToken } from "~/hooks/onchain/useAccessToken";
import { useWallet } from "@meshsdk/react";
import LoadingCircle from "~/ui/studio/components/ContentEditor/ui/icons/loading-circle";
import { useTask } from "~/hooks/contribution/useTask";

export default function MintProjectToken({
  treasuryNftPolicyId,
  contributorsToAdd,
  projects,
  taskIds,
  setSuccessTxHash
}: {
  treasuryNftPolicyId?: string;
  contributorsToAdd?: string[];
  projects: string;
  taskIds: string[];
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { accessTokenAsset } = useAccessToken();
  const { wallet } = useWallet();
  const { updateTaskStatuses } = useTask({ treasuryNftPolicyId })

  const {
    data: unsignedTxCBOR,
    isLoading,
    error: txError
  } = api.projectManagerTransactions.mintProjectToken.useQuery(
    {
      userAccessTokenUnit: accessTokenAsset?.unit ?? "",
      treasuryNftPolicyId: treasuryNftPolicyId ?? "",
      allowedContributors: contributorsToAdd ?? [],
      projects: projects
    },
    {
      // Don't attempt the query without inputs 
      enabled: !!accessTokenAsset && !!treasuryNftPolicyId && !!contributorsToAdd,
    }

  );

  const handleStatusChange = () => {
    updateTaskStatuses({
      taskIds: taskIds,
      status: "ON_CHAIN",
    });
  };

  if (txError) {
    return (
      <div className="mx-4 flex items-center justify-center rounded-md border px-4 py-3 font-mono text-sm">
        <h2>Transaction Error</h2>
        <p>{txError.message}</p>
      </div>
    );
  }


  return (
    <TransactionContainer
      buttonText={`Mint Project Token`}
      unsignedTxCBOR={unsignedTxCBOR}
      wallet={wallet}
      setSuccessTxHash={setSuccessTxHash}
      onTransactionSuccess={handleStatusChange}
    />
  );

}
