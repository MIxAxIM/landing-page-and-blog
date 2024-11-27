import { api } from "~/utils/api";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/transactions/TransactionContainer";
import { useAccessToken } from "~/hooks/onchain/useAccessToken";
import { useWallet } from "@meshsdk/react";
import { useContributorPrerequisite } from "~/hooks/contribution/useContributorPrerequisite";

export default function MintProjectState({
  treasuryNftPolicyId,
  contributorPolicyId,
  setSuccessTxHash,
}: {
  treasuryNftPolicyId: string;
  contributorPolicyId: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { accessTokenAsset } = useAccessToken();
  const { wallet } = useWallet();
  const { prerequisiteByPolicyId } = useContributorPrerequisite({ contributorPolicyId: contributorPolicyId })

  const [formattedPrereqs, setFormattedPrereqs] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (prerequisiteByPolicyId) {
      const _formattedPrereqs = prerequisiteByPolicyId.courseRequirements.map(cm => [cm.course?.courseCreatorNFTPolicyID, cm.requiredModules])
      setFormattedPrereqs(JSON.stringify(_formattedPrereqs))

    }
  }, [prerequisiteByPolicyId])

  const {
    data: unsignedTxCBOR,
    error: txError,
  } = api.contributorTransactions.mintProjectState.useQuery(
    {
      treasuryNftPolicyId: treasuryNftPolicyId ?? "",
      userAccessTokenUnit: accessTokenAsset?.unit ?? "",
      prerequisite: formattedPrereqs ?? "",
    },
    {
      // Don't attempt the query if we don't have an alias
      enabled: !!treasuryNftPolicyId && !!accessTokenAsset && !!formattedPrereqs
    },
  );

  if (txError) {
    return (
      <div className="mx-4 flex items-center justify-center rounded-md border px-4 py-3 font-mono text-sm">
        <h2>Transaction Error</h2>
        <p>{JSON.stringify(txError.message)}</p>
      </div>
    );
  }

  return (
    <div>
      <pre className="text-xs">
        {JSON.stringify(prerequisiteByPolicyId, null, 2)}
      </pre>

      <TransactionContainer
        buttonText={`Mint Project State`}
        unsignedTxCBOR={unsignedTxCBOR}
        wallet={wallet}
        setSuccessTxHash={setSuccessTxHash}
      />
    </div>
  );
}
