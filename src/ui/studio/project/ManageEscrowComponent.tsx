import { useEffect, useState } from "react";
import { type Task } from "~/types/db";
import { useEscrow } from "~/hooks/db/contribution/useEscrow";
import useProjectByTreasury from "~/hooks/cardano-indexer-api/project/useProjectByTreasury";
import EscrowUtxoTable from "./EscrowUtxoTable";
import EnrolledContributors from "./EnrolledContributors";
import ProjectAcceptanceCriteria from "./ProjectAcceptanceCriteria";
import ProjectTreasuryBalance from "./ProjectTreasuryBalance";
import ManageTreasuryTokenDialog from "~/components/cardano/tx/project-creator/manage-treasury-token/ManageTreasuryTokenDialog";
import ProjectFundingSummaryTable from "./ProjectFundingSummaryTable";
import { useTaskStatusCheck } from "~/hooks/cardano-indexer-api/polling/useTaskStatusCheck";
import ContributorPrerequisites from "./ContributorPrerequisites";
import { usePrerequisitePolicyCheck } from "~/hooks/cardano-indexer-api/polling/usePrerequisitePolicyCheck";
import DialogTaskSimple from "./components/dialogs/DialogTaskSimple";
import ProjectTaskManagementList from "./components/lists/ProjectTaskManagementList";
import MintProjectTokenDialog from "~/components/cardano/tx/project-creator/mint-project-token/MintProjectTokenDialog";


export default function ManageEscrowComponent({
  escrowId,
  treasuryNftPolicyId,
}: {
  escrowId: string;
  treasuryNftPolicyId?: string | null;
}) {
  usePrerequisitePolicyCheck(treasuryNftPolicyId ?? "")

  const { escrow } = useEscrow({ id: escrowId });

  const { treasuryInfo, escrowUtxos, contributorPolicies, isLoadingTreasuryInfo } = useProjectByTreasury({ treasuryNftPolicyId: treasuryNftPolicyId ?? undefined })

  const [tasksToPublish, setTasksToPublish] = useState<Task[]>([])
  const [tasksToManage, setTasksToManage] = useState<Task[]>([])

  useTaskStatusCheck(treasuryNftPolicyId ?? "")

  useEffect(() => {
    if (!!escrow?.tasks) {
      const _tasks = escrow.tasks.filter(t => t.status === "APPROVED")
      setTasksToPublish(_tasks)
      const _manageTasks = escrow.tasks.filter(t => (t.status === "APPROVED" || t.status === "ON_CHAIN"))
      setTasksToManage(_manageTasks)
    }
  }, [escrow])

  return (
    <div key={escrowId}>
      <div className="mx-auto mb-48 mt-12 grid min-h-[screen] w-full grid-cols-10 gap-8">
        <div className="col-span-10 mb-6 flex flex-row items-center justify-between">
          <h1>{escrow?.title}</h1>
          {!!treasuryInfo && (
            <ProjectTreasuryBalance
              treasuryInfo={treasuryInfo}
              treasuryNftPolicyId={treasuryNftPolicyId ?? ""}
              isLoading={isLoadingTreasuryInfo}
            />
          )}
          {!!escrow && <DialogTaskSimple treasuryId={escrow.treasuryId} escrow={escrow} />}
        </div>
        <div className="col-span-10 row-span-2 flex flex-col w-full">
          <h2>
            Manage All Tasks
          </h2>
          {!!escrow?.tasks && treasuryNftPolicyId?.length === 56 && (
            <ProjectTaskManagementList
              treasuryId={escrow.treasuryId}
              treasuryNftPolicyId={treasuryNftPolicyId}
              escrow={escrow}
              networkTasks={treasuryInfo?.projects ?? []}
            />
          )}

          <div className="w-full mx-auto justify-between flex flex-row">
            {!!treasuryNftPolicyId && !!tasksToPublish && !!contributorPolicies && (
              <MintProjectTokenDialog
                treasuryNftPolicyId={treasuryNftPolicyId}
                tasksToPublish={tasksToPublish}
                contributorPolicies={contributorPolicies}
              />
            )}
            {!!treasuryNftPolicyId && !!tasksToPublish && !!contributorPolicies && (
              <ManageTreasuryTokenDialog
                treasuryNftPolicyId={treasuryNftPolicyId}
                tasksToManage={tasksToManage}
                contributorPolicies={contributorPolicies}
              />
            )}
          </div>
        </div>
        <>
          <div className="col-span-4 flex flex-col">
            <ProjectFundingSummaryTable treasuryId={escrow?.treasuryId ?? ""} />
          </div>
          <div className="col-span-6">
            <ContributorPrerequisites escrowId={escrowId} treasuryNftPolicyId={treasuryNftPolicyId ?? ""} />
          </div>
          <div className="col-span-4">
            <ProjectAcceptanceCriteria escrowId={escrowId} />
          </div>
          <div className="col-span-6 flex flex-col">
            <EnrolledContributors treasuryNftPolicyId={treasuryNftPolicyId} />
          </div>
          <div className="col-span-10 flex flex-col">
            <EscrowUtxoTable utxos={escrowUtxos ?? []} treasuryNftPolicyId={treasuryNftPolicyId ?? ""} />
          </div>
        </>
      </div>

    </div>
  );
}

