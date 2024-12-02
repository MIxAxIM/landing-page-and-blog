import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/cardano/TransactionContainer";
import useCourseByPolicyId from "~/hooks/cardano-indexer-api/useCourseByPolicyId";
import { api } from "~/utils/api";

export default function MintLocalState({
  userAccessTokenUnit,
  courseNftPolicyId,
  setSuccessTxHash,
}: {
  userAccessTokenUnit: string;
  courseNftPolicyId: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { courseInfo } = useCourseByPolicyId(courseNftPolicyId);

  const { wallet } = useWallet();

  const { data: unsignedTxCBOR } =
    api.learnerCourseTransactions.mintLocalState.useQuery({
      userAccessTokenUnit: userAccessTokenUnit,
      courseNftPolicyId: courseNftPolicyId,
    });

  return (
    <TransactionContainer
      buttonText={`Enroll In ${courseInfo?.title}`}
      unsignedTxCBOR={unsignedTxCBOR}
      wallet={wallet}
      setSuccessTxHash={setSuccessTxHash}
    />
  );
}
