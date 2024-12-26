import { useEffect, useState } from "react";

import { useEscrow } from "~/hooks/db/contribution/useEscrow";
import { useRoles } from "~/hooks/app/useRoles";

import OnboardingStatusButtons from "~/ui/onboarding/components/OnboardingStatusButtons";
import ProjectManagerOnboardingModal from "~/ui/onboarding/components/tutorial-modals/ProjectManagerOnboardingModal";

import ProjectAcceptanceCriteria from "./ProjectAcceptanceCriteria";
import ProjectFundingSummaryTable from "./ProjectFundingSummaryTable";
import ProjectTaskManagementList from "~/ui/contribution/lists/ProjectTaskManagementList";
import DialogTaskSimple from "~/ui/contribution/dialogs/DialogTaskSimple";
import ContributorPrerequisites from "./ContributorPrerequisites";
import { Button } from "~/components/ui/button";


export default function PreviewManageEscrowComponent({
  escrowId,
}: {
  escrowId: string;
}) {

  const [showOnboardingModal, setShowOnboardingModal] = useState(true);
  const { escrow } = useEscrow({ id: escrowId });
  const { updateTreasuryManagerOnboardingStatus, getTreasuryOwner } = useRoles()
  const { data: treasuryOwnerStatus } = getTreasuryOwner()

  useEffect(() => {
    if (treasuryOwnerStatus?.onboardingStatus === "PARTIAL" ||
      treasuryOwnerStatus?.onboardingStatus === "NOT_STARTED") {
      setShowOnboardingModal(true);
    }
  }, [treasuryOwnerStatus?.onboardingStatus]);

  return (
    <div key={escrowId}>
      <ProjectManagerOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />
      <div className="mx-auto mb-48 mt-12 grid min-h-[screen] w-full grid-cols-10 gap-8 border-secondary border-2 p-5 pb-[300px]">
        <div className="bg-primary text-primary-foreground p-5 flex w-full col-span-10 justify-between">
          <div className="max-w-5xl">
            This is a preview of the Contribution Manager view. In this view, you can can draft tasks, set acceptance criteria, and prepare prerequisites for your project. When you are ready, publish the project on the Andamio Network to unlock full features and start inviting contributors to your project. -- Product meeting 2024-12-17 - we can use this preview to try some onboarding features: hotspots, tooltips, tutorials, etc.
          </div>
          <Button className="border border-white">
            Initialize my Project on the Andamio Network
          </Button>
        </div>
        <div className="col-span-10 mb-6 flex flex-row items-center justify-between">
          <h1>{escrow?.title}</h1>
          {!!escrow && <DialogTaskSimple treasuryId={escrow.treasuryId} escrow={escrow} />}
        </div>
        <div className="col-span-10 row-span-2 flex flex-col w-full">
          <h2>
            Manage All Tasks
          </h2>
          {!!escrow?.tasks && (
            <ProjectTaskManagementList
              treasuryId={escrow.treasuryId}
              escrow={escrow}
            />
          )}
        </div>
        {(treasuryOwnerStatus?.onboardingStatus === "COMPLETE" || treasuryOwnerStatus?.onboardingStatus === "SKIPPED") && (
          <>
            <div className="col-span-10">
              <ContributorPrerequisites escrowId={escrowId} />
            </div>
            <div className="col-span-5 flex flex-col">
              <ProjectFundingSummaryTable treasuryId={escrow?.treasuryId ?? ""} />
            </div>
            <div className="col-span-5">
              <ProjectAcceptanceCriteria escrowId={escrowId} />
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

