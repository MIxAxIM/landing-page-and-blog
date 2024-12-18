import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { useToast } from "~/components/ui/use-toast";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";
import TransactionPlaceholderComponent from "~/components/placeholders/TransactionPlaceholderComponent";
import TransactionLoading from "~/components/cardano/common/TransactionLoading";
import useCourse from "~/hooks/db/course/useCourse";
import useCourseById from "~/hooks/db/course/useCourseById";

export default function InitCourse({
  alias,
  courseId,
  setSuccessTxHash,
}: {
  alias: string;
  courseId: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { toast } = useToast();
  const { updateCourse } = useCourse();
  //courseCode: string;
  //title: string;
  //courseNftPolicyId?: string;

  const { wallet } = useWallet();
  const { course } = useCourseById(courseId);

  const { data: builtTxResponse } =
    api.andamioAdminTransactions.initCourseStepOne.useQuery({
      aliases: [alias],
    });

  if (!course) return

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
        updateCourse({
          courseCode: course?.courseCode ?? "",
          title: course?.title ?? "",
          courseNftPolicyId: builtTxResponse.courseNftPolicyId,
        });
      }
    }
  }


  return (
    <TransactionPlaceholderComponent name="StepOneMintCourseNft">
      {builtTxResponse ? (
        <>
          <Button onClick={onSubmit}>
            Course Instance Step 1: Mint Course NFT
          </Button>
          <p>This will mint a Course NFT with policy id:</p>
          <pre>{builtTxResponse.courseNftPolicyId}</pre>
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
