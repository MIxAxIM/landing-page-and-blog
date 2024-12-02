import { useWallet } from "@meshsdk/react";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";

export default function BurnLocalState({
  accessTokenAssetId,
  courseNftPolicyId,
  setSuccessTxHash,
}: {
  accessTokenAssetId: string;
  courseNftPolicyId: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { wallet } = useWallet();

  const { data: unsignedTxCBOR } =
    api.learnerCourseTransactions.burnLocalState.useQuery({
      userAccessTokenUnit: accessTokenAssetId,
      courseNftPolicyId: courseNftPolicyId,
    });

  return (
    <TransactionContainer
      buttonText={`Un-Enroll in Course`}
      unsignedTxCBOR={unsignedTxCBOR}
      wallet={wallet}
      setSuccessTxHash={setSuccessTxHash}
    />
  );
}
