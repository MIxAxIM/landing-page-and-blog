import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { type CourseModuleOverview } from "~/types/db";
import { api } from "~/utils/api";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { ModuleStatus } from "@prisma/client";
import useCourseModule from "~/hooks/db/course/useCourseModule";
import TransactionCostDetails, { CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";

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


  // Any tx will have a set of outputs.
  // Build a re-usable component where we can match a description to an output index -- this would be helpful for all transactions
  const costBreakdown: CostBreakdown = {
    costDescriptions: [
      { txOutputIndex: 1, description: "Module Credential Token", tooltipText: "Store min utxo with a token and SLT datum." },
    ],
    andamioNetworkFee: 2000000, // How to incorporate network fee -> Dev team 2024-12-09
  }

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
    <div className="flex flex-col w-full mx-auto">
      {!!unsignedTxCBOR && (
        <TransactionCostDetails unsignedTxCBOR={unsignedTxCBOR.unsignedTxCBOR} costBreakdown={costBreakdown} />
      )}
      <TransactionContainer
        buttonText={`Publish Credential Criteria for module`}
        unsignedTxCBOR={unsignedTxCBOR}
        wallet={wallet}
        setSuccessTxHash={setSuccessTxHash}
        onTransactionSuccess={updateModuleStatusCallback}
      />
    </div >
  );
}


