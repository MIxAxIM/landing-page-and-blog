import { useEscrow } from "~/hooks/contribution/useEscrow";
import DialogEscrow from "~/ui/contribution/dialogs/DialogEscrow";
import DialogPrerequisite from "~/ui/contribution/dialogs/DialogPrerequisite";
import PrerequisiteSelectionManager from "~/ui/contribution/selection/PrerequisiteSelectionManager";
import EscrowAcceptanceCriteriaForm from "~/ui/forms/EscrowAcceptanceCriteriaForm";
import EscrowTaskListComponent from "~/ui/contribution/lists/EscrowTaskListComponent";
import DialogTask from "~/ui/contribution/dialogs/DialogTask";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { useTerminology } from "~/contexts/terminology-context";
import OnboardingStatusButtons from "~/ui/onboarding/components/OnboardingStatusButtons";
import { useRoles } from "~/hooks/app/useRoles";
import { useEffect, useState } from "react";
import useProjectByTreasury from "~/hooks/onchain/useProjects";
import { Task } from "~/types/db";
import ProjectManagerOnboardingModal from "~/ui/onboarding/components/tutorial-modals/ProjectManagerOnboardingModal";
import MintProjectTokenDialog from "~/components/cardano/dialogs/MintProjectTokenDialog";
import AddFundsDialog from "~/components/cardano/dialogs/AddFundsDialog";
import DebugProjects from "../../DebugProjects";

export default function ManageEscrowComponent({
  escrowId,
  treasuryNftPolicyId,
}: {
  escrowId: string;
  treasuryNftPolicyId?: string | null;
}) {

  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const { escrow } = useEscrow({ id: escrowId });
  const { translate, translateCaps, translateCapsPlural } = useTerminology()
  const { updateTreasuryManagerOnboardingStatus, getTreasuryOwner } = useRoles()
  const { data: treasuryOwnerStatus } = getTreasuryOwner()

  const { contributorPolicies } = useProjectByTreasury({ treasuryNftPolicyId: treasuryNftPolicyId ?? undefined })

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
    <div>
      <ProjectManagerOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />
      <div className="mx-auto mb-48 mt-12 grid min-h-[screen] w-11/12 grid-cols-6 gap-10">
        <div className="col-span-6 mb-12 flex flex-row items-center justify-between">
          <h1>{escrow?.title}</h1>
          {treasuryOwnerStatus && (
            <OnboardingStatusButtons
              roleId={treasuryOwnerStatus.id}
              onStatusChange={updateTreasuryManagerOnboardingStatus}
            />

          )}
          <div className="space-x-2">
            <DialogEscrow id={escrow?.id} treasuryId={escrow?.treasuryId} />
            {!!escrow && (
              <DialogTask escrow={escrow} treasuryId={escrow.treasuryId} />
            )}
          </div>
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
          {!!treasuryNftPolicyId &&
            <AddFundsDialog treasuryNftPolicyId={treasuryNftPolicyId} />
          }
        </div>
        {(treasuryOwnerStatus?.onboardingStatus === "COMPLETE" || treasuryOwnerStatus?.onboardingStatus === "SKIPPED") && (
          <>
            <div className="col-span-3">
              <Accordion type="single" collapsible>
                <AccordionItem value="contrib-prereqs">
                  <AccordionTrigger className="flex min-h-32 w-full flex-col bg-primary p-3 py-2 text-primary-foreground">
                    <h2>
                      Contributor Prerequisites
                    </h2>
                    <p className="w-2/3 mx-auto mb-5">
                      To commit to a task in this {translateCaps('escrow')}, a Contributor must
                      complete the following Course {translateCapsPlural('prerequisite')}
                    </p>
                  </AccordionTrigger>
                  <AccordionContent className="border border-primary">
                    <div className="p-3">
                      {!!escrow?.id && (
                        <PrerequisiteSelectionManager escrowId={escrow.id} />
                      )}
                      <DialogPrerequisite />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="col-span-3">
              <Accordion type="single" collapsible>
                <AccordionItem value="acceptance-criteria">
                  <AccordionTrigger className="flex min-h-32 w-full flex-col bg-primary p-3 py-2 text-primary-foreground">
                    <h2>
                      {translateCaps('escrow')} {translateCaps('acceptanceCriteria')}
                    </h2>
                    <p className="w-2/3 mx-auto mb-5">
                      For any {translate('escrow')}, you can create a list of pre-defined
                      {translateCaps('acceptanceCriteria')} that will be preloaded into new {translateCapsPlural("task")}.
                    </p>
                  </AccordionTrigger>
                  <AccordionContent className="border border-primary">
                    <div className="p-3">
                      {!!escrow?.id && (
                        <EscrowAcceptanceCriteriaForm escrowId={escrow.id} />
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </>
        )}
      </div>
      <DebugProjects />
    </div>
  );
}
