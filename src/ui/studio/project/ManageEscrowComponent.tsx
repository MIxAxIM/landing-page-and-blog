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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import AddFundsDialog from "~/components/cardano/tx/treasury/add-funds/AddFundsDialog";


export default function ManageEscrowComponent({
  escrowId,
  treasuryNftPolicyId,
}: {
  escrowId: string;
  treasuryNftPolicyId?: string | null;
}) {
  usePrerequisitePolicyCheck(treasuryNftPolicyId ?? "")

  const { escrow } = useEscrow({ id: escrowId });

  const { treasuryInfo, escrowUtxos, contributorPolicies, isLoadingTreasuryInfo, hasProjectToken } = useProjectByTreasury({ treasuryNftPolicyId: treasuryNftPolicyId ?? undefined })

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
      <div className="mx-auto mb-48 mt-12 min-h-[screen] w-full gap-8">
        <div className="mb-6 flex flex-row items-center justify-between">
          <h1>{escrow?.title}</h1>
          {!!treasuryInfo && (
            <ProjectTreasuryBalance
              treasuryInfo={treasuryInfo}
              treasuryNftPolicyId={treasuryNftPolicyId ?? ""}
              isLoading={isLoadingTreasuryInfo}
            />
          )}
          {!!escrow && <DialogTaskSimple treasuryId={escrow.treasuryId} escrow={escrow} />}
          {!!escrow && !!treasuryNftPolicyId && <AddFundsDialog treasuryNftPolicyId={treasuryNftPolicyId} />}
          {!!treasuryNftPolicyId && !!tasksToPublish && !!contributorPolicies && (
            <>
              {hasProjectToken ? (
                <ManageTreasuryTokenDialog
                  treasuryNftPolicyId={treasuryNftPolicyId}
                  tasksToManage={tasksToManage}
                  contributorPolicies={contributorPolicies}
                />
              ) : (
                <MintProjectTokenDialog
                  treasuryNftPolicyId={treasuryNftPolicyId}
                  tasksToPublish={tasksToPublish}
                  contributorPolicies={contributorPolicies}
                />
              )}
            </>
          )}
        </div>
        <Tabs defaultValue="summary" className="">
          <TabsList className="w-full">
            <TabsTrigger value="summary" className="px-10">
              Project Summary
            </TabsTrigger>
            <TabsTrigger value="tasks" className="px-10">
              Manage All Tasks
            </TabsTrigger>
            <TabsTrigger value="contributors" className="px-10">
              Contributors and Prerequisites
            </TabsTrigger>
            <TabsTrigger value="acceptanceCriteria" className="px-10">
              Acceptance Criteria
            </TabsTrigger>
            <TabsTrigger value="currentCommitments" className="px-10">
              Current Commitments
            </TabsTrigger>

          </TabsList>

          <TabsContent value="tasks">
            {!!escrow?.tasks && treasuryNftPolicyId?.length === 56 && (
              <ProjectTaskManagementList
                treasuryId={escrow.treasuryId}
                treasuryNftPolicyId={treasuryNftPolicyId}
                escrow={escrow}
                networkTasks={treasuryInfo?.projects ?? []}
              />
            )}
          </TabsContent>
          <TabsContent value="summary">
            <ProjectFundingSummaryTable treasuryId={escrow?.treasuryId ?? ""} />
          </TabsContent>
          <TabsContent value="contributors">
            <ContributorPrerequisites escrowId={escrowId} treasuryNftPolicyId={treasuryNftPolicyId ?? ""} />
            <EnrolledContributors treasuryNftPolicyId={treasuryNftPolicyId} />
          </TabsContent>
          <TabsContent value="acceptanceCriteria">
            <ProjectAcceptanceCriteria escrowId={escrowId} />
          </TabsContent>
          <TabsContent value="currentCommitments">
            <EscrowUtxoTable utxos={escrowUtxos ?? []} treasuryNftPolicyId={treasuryNftPolicyId ?? ""} />
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}

