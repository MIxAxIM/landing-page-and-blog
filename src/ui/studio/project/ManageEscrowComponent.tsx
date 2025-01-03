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
import { useTreasury } from "~/hooks/db/contribution/useTreasury";


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
  const { treasuryAmountsByStatus } = useTreasury(escrow?.treasuryId ?? "")

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
        </div>
        <div className="mb-6 flex flex-row items-center justify-between w-full md:w-2/3 lg:w-1/2">
          <p>Project Actions:</p>
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
              Create Tasks for this Project
            </TabsTrigger>
            <TabsTrigger value="contributors" className="px-10">
              Define Prerequisites and View Contributors
            </TabsTrigger>
            <TabsTrigger value="acceptanceCriteria" className="px-10">
              Define Acceptance Criteria
            </TabsTrigger>
            <TabsTrigger value="currentCommitments" className="px-10">
              View and Manage Current Commitments
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
            {!!treasuryAmountsByStatus && (
              <ProjectFundingSummaryTable treasuryAmountsByStatus={treasuryAmountsByStatus} />
            )}
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

