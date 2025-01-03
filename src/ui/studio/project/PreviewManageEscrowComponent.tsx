import { useEffect, useState } from "react";

import { useEscrow } from "~/hooks/db/contribution/useEscrow";
import { useRoles } from "~/hooks/app/useRoles";

import OnboardingStatusButtons from "~/ui/onboarding/components/OnboardingStatusButtons";
import ProjectManagerOnboardingModal from "~/ui/onboarding/components/tutorial-modals/ProjectManagerOnboardingModal";

import ProjectAcceptanceCriteria from "./ProjectAcceptanceCriteria";
import ProjectFundingSummaryTable from "./ProjectFundingSummaryTable";
import ContributorPrerequisites from "./ContributorPrerequisites";
import { Button } from "~/components/ui/button";
import DialogTaskSimple from "./components/dialogs/DialogTaskSimple";
import ProjectTaskManagementList from "./components/lists/ProjectTaskManagementList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useTreasury } from "~/hooks/db/contribution/useTreasury";


export default function PreviewManageEscrowComponent({
  escrowId,
}: {
  escrowId: string;
}) {

  const [showOnboardingModal, setShowOnboardingModal] = useState(true);
  const { escrow } = useEscrow({ id: escrowId });
  const { updateTreasuryManagerOnboardingStatus, getTreasuryOwner } = useRoles()
  const { data: treasuryOwnerStatus } = getTreasuryOwner()

  const { treasuryAmountsByStatus } = useTreasury(escrow?.treasuryId ?? "")

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
      <div className="flex flex-col mx-auto mb-48 mt-12 min-h-[screen] w-full border-secondary border-2 p-5 pb-[300px]">
        <div className="bg-primary text-primary-foreground p-5 flex w-full justify-between">
          <div className="max-w-5xl">
            This is a preview of the Contribution Manager view. In this view, you can can draft tasks, set acceptance criteria, and prepare prerequisites for your project. When you are ready, publish the project on the Andamio Network to unlock full features and start inviting contributors to your project. -- Product meeting 2024-12-17 - we can use this preview to try some onboarding features: hotspots, tooltips, tutorials, etc.
          </div>
          <Button className="border border-white">
            Initialize my Project on the Andamio Network
          </Button>
        </div>
        <div className="mb-6 flex flex-row items-center justify-between">
          <h1>{escrow?.title}</h1>
          {!!escrow && <DialogTaskSimple treasuryId={escrow.treasuryId} escrow={escrow} />}
        </div>
        <div className="mb-6 flex flex-row items-center justify-between">
          {treasuryOwnerStatus && (
            <OnboardingStatusButtons
              roleId={treasuryOwnerStatus.id}
              onStatusChange={updateTreasuryManagerOnboardingStatus}
            />
          )}
        </div>
        <Tabs defaultValue="tasks">
          <TabsList className="w-full">
            <TabsTrigger value="tasks" className="px-10">
              Create Tasks for this Project
            </TabsTrigger>
            {(treasuryOwnerStatus?.onboardingStatus === "COMPLETE" || treasuryOwnerStatus?.onboardingStatus === "SKIPPED") && (
              <>
                <TabsTrigger value="summary" className="px-10">
                  Project Summary
                </TabsTrigger>
                <TabsTrigger value="contributors" className="px-10">
                  Define Prerequisites and View Contributors
                </TabsTrigger>
                <TabsTrigger value="acceptanceCriteria" className="px-10">
                  Define Acceptance Criteria
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="tasks" className="flex flex-col items-center">
            {!!escrow?.tasks && (
              <>
                <ProjectTaskManagementList
                  treasuryId={escrow.treasuryId}
                  escrow={escrow}
                />
                {!!escrow && <DialogTaskSimple treasuryId={escrow.treasuryId} escrow={escrow} />}
              </>
            )}
          </TabsContent>
          {(treasuryOwnerStatus?.onboardingStatus === "COMPLETE" || treasuryOwnerStatus?.onboardingStatus === "SKIPPED") && (
            <>
              <TabsContent value="summary">
                <>
                  {!!treasuryAmountsByStatus && (
                    <ProjectFundingSummaryTable treasuryAmountsByStatus={treasuryAmountsByStatus} />
                  )}
                </>
              </TabsContent>
              <TabsContent value="contributors">
                <ContributorPrerequisites escrowId={escrowId} />
              </TabsContent>
              <TabsContent value="acceptanceCriteria">
                <ProjectAcceptanceCriteria escrowId={escrowId} />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

    </div>
  );
}

