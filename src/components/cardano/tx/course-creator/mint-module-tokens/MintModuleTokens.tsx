import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { type CourseModuleOverview } from "~/types/db";
import { api } from "~/utils/api";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { ModuleStatus } from "@prisma/client";
import useCourseModule from "~/hooks/db/course/useCourseModule";

export default function MintModuleTokens({
  accessTokenAssetId,
  courseNftPolicyId,
  courseModuleOverview,
  setSuccessTxHash,
}: {
  accessTokenAssetId: string;
  courseNftPolicyId: string;
  courseModuleOverview: CourseModuleOverview;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { wallet } = useWallet();
  const { updateModuleStatus } = useCourseModule(courseModuleOverview.id);

  const slts = courseModuleOverview.slts.map((slt) => ({
    sltId: slt.moduleIndex.toString(),
    sltContent: slt.sltText,
  }));

  const courseModuleDetails = [
    {
      moduleId: courseModuleOverview.moduleCode,
      slts: slts,
      assignmentContent: courseModuleOverview.assignments[0]?.title,
    },
  ];

  const { data: unsignedTxCBOR } =
    api.courseCreatorTransactions.mintCourseModule.useQuery({
      userAccessTokenUnit: accessTokenAssetId,
      courseNftPolicyId: courseNftPolicyId,
      moduleInfos: JSON.stringify(courseModuleDetails),
    });

  const updateModuleStatusCallback = async (txId: string) => {
    if (!courseModuleOverview.id || !txId) return;

    updateModuleStatus({
      id: courseModuleOverview.id,
      status: ModuleStatus.PENDING_TX
    });
  };

  return (
    <TransactionContainer
      buttonText={`Publish Credential Criteria for module`}
      unsignedTxCBOR={unsignedTxCBOR}
      wallet={wallet}
      setSuccessTxHash={setSuccessTxHash}
      onTransactionSuccess={updateModuleStatusCallback}
    />
  );
}
