import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import TransactionContainer from "~/components/cardano/TransactionContainer";

export default function AcceptDenyAssignment({
  courseNftPolicy,
  userAccessTokenUnit,
  studentAlias,
  decision,
  setSuccessTxHash,
}: {
  courseNftPolicy: string;
  userAccessTokenUnit: string;
  studentAlias: string;
  decision: "accept" | "deny";
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { wallet } = useWallet();

  const { data: unsignedTxCBOR, error: txError } =
    decision === "accept"
      ? api.creatorCourseTransactions.acceptAssignment.useQuery({
        userAccessTokenUnit: userAccessTokenUnit,
        courseNftPolicyId: courseNftPolicy,
        studentAlias: studentAlias,
      })
      : api.creatorCourseTransactions.denyAssignment.useQuery({
        userAccessTokenUnit: userAccessTokenUnit,
        courseNftPolicyId: courseNftPolicy,
        studentAlias: studentAlias,
      });

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
      buttonText={`${decision} assignment`}
      unsignedTxCBOR={unsignedTxCBOR}
      wallet={wallet}
      setSuccessTxHash={setSuccessTxHash}
    />
  );
}
