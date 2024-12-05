import { useEffect, useState } from "react";
import { Task } from "~/types/db";

import { useEscrow } from "~/hooks/db/contribution/useEscrow";
import { useRoles } from "~/hooks/app/useRoles";
import useProjectByTreasury from "~/hooks/cardano-indexer-api/project/useProjects";

import DialogTaskSimple from "~/ui/contribution/dialogs/DialogTaskSimple";
import EscrowTaskListComponent from "~/ui/contribution/lists/EscrowTaskListComponent";
import OnboardingStatusButtons from "~/ui/onboarding/components/OnboardingStatusButtons";
import ProjectManagerOnboardingModal from "~/ui/onboarding/components/tutorial-modals/ProjectManagerOnboardingModal";

import AddFundsDialog from "~/components/cardano/tx/treasury/add-funds/AddFundsDialog";

import EscrowUtxoTable from "./EscrowUtxoTable";
import PublishedProjectsTable from "./PublishedProjectsTable";
import EnrolledContributors from "./EnrolledContributors";
import ContributorPrerequisites from "./ContributorPrerequisites";
import ProjectAcceptanceCriteria from "./ProjectAcceptanceCriteria";
import ProjectTreasuryBalance from "./ProjectTreasuryBalance";
import MintProjectTokenDialog from "~/components/cardano/tx/project-manager/mint-project-token/MintProjectTokenDialog";

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

  const { treasuryInfo, escrowUtxos, contributorPolicies } = useProjectByTreasury({ treasuryNftPolicyId: treasuryNftPolicyId ?? undefined })

  const [tasksToPublish, setTasksToPublish] = useState<Task[]>([])

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
    }
  }, [escrow])


  return (
    <div key={escrowId}>
      <ProjectManagerOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />
      <div className="mx-auto mb-48 mt-12 grid min-h-[screen] w-full grid-cols-6 gap-3">
        <div className="col-span-6 mb-6 flex flex-row items-center justify-between">
          <h1>{escrow?.title}</h1>
          <div className="space-x-2">
            {!!escrow && (
              <DialogTaskSimple escrow={escrow} treasuryId={escrow.treasuryId} />
            )}
          </div>
        </div>
        <div className="col-span-3 flex flex-col">
          <ProjectTreasuryBalance treasuryInfo={treasuryInfo} treasuryNftPolicyId={treasuryNftPolicyId ?? ""} />
        </div>
        <div className="col-span-3 flex flex-col">
          <EnrolledContributors treasuryNftPolicyId={treasuryNftPolicyId} />
        </div>
        <div className="col-span-3 flex flex-col">
          <EscrowUtxoTable utxos={escrowUtxos ?? []} />
        </div>
        <div className="col-span-3 flex flex-col">
          <PublishedProjectsTable projects={treasuryInfo?.projects ?? []} />
        </div>
        <div className="col-span-6 flex w-full">
          <div>
            <h2>
              {escrow?.title} Task List
            </h2>
            {!!escrow?.tasks && (
              <EscrowTaskListComponent
                treasuryId={escrow.treasuryId}
                escrow={escrow}
              />
            )}
          </div>
        </div>
        <div className="col-span-6 flex flex-col space-y-5 w-full">
          {!!treasuryNftPolicyId && !!tasksToPublish && !!contributorPolicies && (
            <MintProjectTokenDialog
              treasuryNftPolicyId={treasuryNftPolicyId}
              tasksToPublish={tasksToPublish}
              contributorPolicies={contributorPolicies}
            />
          )}
        </div>
        {(treasuryOwnerStatus?.onboardingStatus === "COMPLETE" || treasuryOwnerStatus?.onboardingStatus === "SKIPPED") && (
          <>
            <div className="col-span-3">
              <ContributorPrerequisites escrowId={escrowId} treasuryNftPolicyId={treasuryNftPolicyId ?? ""} />
            </div>
            <div className="col-span-3">
              <ProjectAcceptanceCriteria escrowId={escrowId} />
            </div>
          </>
        )}
        <div className="col-span-4">
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

