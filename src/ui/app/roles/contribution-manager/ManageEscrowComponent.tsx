import { useEffect, useState } from "react";
import { Task } from "~/types/db";

import { useEscrow } from "~/hooks/db/contribution/useEscrow";
import { useRoles } from "~/hooks/app/useRoles";
import useProjectByTreasury from "~/hooks/cardano-indexer-api/project/useProjectByTreasury";

import DialogTaskSimple from "~/ui/contribution/dialogs/DialogTaskSimple";
import OnboardingStatusButtons from "~/ui/onboarding/components/OnboardingStatusButtons";
import ProjectManagerOnboardingModal from "~/ui/onboarding/components/tutorial-modals/ProjectManagerOnboardingModal";


import EscrowUtxoTable from "./EscrowUtxoTable";
import EnrolledContributors from "./EnrolledContributors";
import ContributorPrerequisites from "./ContributorPrerequisites";
import ProjectAcceptanceCriteria from "./ProjectAcceptanceCriteria";
import ProjectTreasuryBalance from "./ProjectTreasuryBalance";
import MintProjectTokenDialog from "~/components/cardano/tx/project-manager/mint-project-token/MintProjectTokenDialog";
import ManageTreasuryTokenDialog from "~/components/cardano/tx/project-manager/manage-treasury-token/ManageTreasuryTokenDialog";
import ProjectFundingSummaryTable from "./ProjectFundingSummaryTable";
import { useTaskStatusCheck } from "~/hooks/cardano-indexer-api/polling/useTaskStatusCheck";
import ProjectTaskManagementList from "~/ui/contribution/lists/ProjectTaskManagementList";

export default function ManageEscrowComponent({
  escrowId,
  treasuryNftPolicyId,
}: {
  escrowId: string;
  treasuryNftPolicyId?: string | null;
}) {

  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const { escrow } = useEscrow({ id: escrowId });
  const { updateTreasuryManagerOnboardingStatus, getTreasuryOwner } = useRoles()
  const { data: treasuryOwnerStatus } = getTreasuryOwner()

  const { treasuryInfo, escrowUtxos, contributorPolicies, isLoadingTreasuryInfo } = useProjectByTreasury({ treasuryNftPolicyId: treasuryNftPolicyId ?? undefined })

  const [tasksToPublish, setTasksToPublish] = useState<Task[]>([])
  const [tasksToManage, setTasksToManage] = useState<Task[]>([])

  useTaskStatusCheck(treasuryNftPolicyId ?? "")

  useEffect(() => {
    if (treasuryOwnerStatus?.onboardingStatus === "PARTIAL" ||
      treasuryOwnerStatus?.onboardingStatus === "NOT_STARTED") {
      setShowOnboardingModal(true);
    }
  }, [treasuryOwnerStatus?.onboardingStatus]);

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
      <ProjectManagerOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />
      <div className="mx-auto mb-48 mt-12 grid min-h-[screen] w-full grid-cols-10 gap-8">
        <div className="col-span-10 mb-6 flex flex-row items-center justify-between">
          <h1>{escrow?.title}</h1>
          <ProjectTreasuryBalance
            treasuryInfo={treasuryInfo}
            treasuryNftPolicyId={treasuryNftPolicyId ?? ""}
            isLoading={isLoadingTreasuryInfo}
          />
          <div className="space-x-2">
            {!!escrow && (
              <DialogTaskSimple escrow={escrow} treasuryId={escrow.treasuryId} />
            )}
          </div>
        </div>
        <div className="col-span-10 row-span-2 flex flex-col w-full">
          <h2>
            Manage All Tasks
          </h2>
          {!!escrow?.tasks && (
            <ProjectTaskManagementList
              treasuryId={escrow.treasuryId}
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
        {(treasuryOwnerStatus?.onboardingStatus === "COMPLETE" || treasuryOwnerStatus?.onboardingStatus === "SKIPPED") && (
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
        )}
        <div className="col-span-10">
          {treasuryOwnerStatus && (
            <OnboardingStatusButtons
              roleId={treasuryOwnerStatus.id}
              onStatusChange={updateTreasuryManagerOnboardingStatus}
            />
          )}
        </div>
      </div>
      {/** 
      <DebugProjects />
      **/}

    </div>
  );
}

