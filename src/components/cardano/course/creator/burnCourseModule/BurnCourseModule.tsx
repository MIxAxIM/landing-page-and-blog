import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/cardano/TransactionContainer";
import { type CourseModuleOverview } from "~/types/db";
import { api } from "~/utils/api";

// PLACEHOLDER --- NOT IMPLEMENTED
//
// TODO: Implement this Tx. Ask team about adding it to Andamio API

export default function BurnCourseModule({
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
    api.creatorCourseTransactions.mintCourseModule.useQuery({
      userAccessTokenUnit: accessTokenAssetId,
      courseNftPolicyId: courseNftPolicyId,
      moduleInfos: JSON.stringify(courseModuleDetails),
    });

  return (
    <TransactionContainer
      buttonText={`Remove Credential Criteria for module`}
      unsignedTxCBOR={unsignedTxCBOR}
      wallet={wallet}
      setSuccessTxHash={setSuccessTxHash}
    />
  );
}
