import { useEscrow } from "~/hooks/db/contribution/useEscrow";
import DialogEscrow from "~/ui/contribution/dialogs/DialogEscrow";
import DialogPrerequisite from "~/ui/contribution/dialogs/DialogPrerequisite";
import PrerequisiteSelectionManager from "~/ui/contribution/selection/PrerequisiteSelectionManager";
import EscrowAcceptanceCriteriaForm from "./EscrowAcceptanceCriteriaForm";
import EscrowTaskListComponent from "~/ui/contribution/lists/EscrowTaskListComponent";
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
import useProjectByTreasury from "~/hooks/cardano-indexer-api/project/useProjects";
import { Task } from "~/types/db";
import ProjectManagerOnboardingModal from "~/ui/onboarding/components/tutorial-modals/ProjectManagerOnboardingModal";
import DebugProjects from "../../DebugProjects";
import MintProjectTokenDialog from "~/components/cardano/tx/project-manager/mint-project-token/MintProjectTokenDialog";
import AddFundsDialog from "~/components/cardano/tx/treasury/add-funds/AddFundsDialog";
import DialogTaskSimple from "~/ui/contribution/dialogs/DialogTaskSimple";

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
    <div key={escrowId}>
      <ProjectManagerOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
      />
      <div className="mx-auto mb-48 mt-12 grid min-h-[screen] w-full grid-cols-6 gap-24">
        <div className="col-span-6 mb-12 flex flex-row items-center justify-between">
          <h1>{escrow?.title}</h1>
          <div className="space-x-2">
            {/**
            <DialogEscrow id={escrow?.id} treasuryId={escrow?.treasuryId} />

            **/}
            {!!escrow && (
              <DialogTaskSimple escrow={escrow} treasuryId={escrow.treasuryId} />
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
                  <AccordionTrigger className="flex min-h-32 w-full flex-col p-3 py-2 border border-primary rounded-md">
                    <h2>
                      Contributor Prerequisites
                    </h2>
                    <p className="prose text-lg w-3/5 mx-auto my-5">
                      To commit to a task in this {translateCaps('escrow')}, a Contributor must
                      complete the following Course {translateCapsPlural('prerequisite')}
                    </p>
                  </AccordionTrigger>
                  <AccordionContent className="border border-primary rounded-md min-h-[300px] p-3">
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
                  <AccordionTrigger className="flex min-h-32 w-full flex-col p-3 py-2 border border-primary rounded-md">
                    <h2>
                      {translateCaps('escrow')} {translateCaps('acceptanceCriteria')}
                    </h2>
                    <p className="prose text-lg w-2/3 mx-auto my-5">
                      For any {translate('escrow')}, you can create a list of pre-defined
                      {translateCaps('acceptanceCriteria')} that will be preloaded into new {translateCapsPlural("task")}.
                    </p>
                  </AccordionTrigger>
                  <AccordionContent className="border border-primary rounded-md min-h-[300px] p-3">
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
