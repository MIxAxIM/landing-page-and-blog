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

export default function ManageEscrowComponent({
  escrowCode,
}: {
  escrowCode: string;
}) {
  const { escrow } = useEscrow({ escrowNftPolicyId: escrowCode });
  const { translate, translateCaps, translateCapsPlural } = useTerminology()

  return (
    <div>
      <div className="mx-auto mb-48 mt-12 grid min-h-[screen] w-11/12 grid-cols-6 gap-10">
        <div className="col-span-6 mb-12 flex flex-row items-center justify-between">
          <h1>{escrow?.title}</h1>
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
        <div className="col-span-3">
          <Accordion type="single" collapsible>
            <AccordionItem value="contrib-prereqs">
              <AccordionTrigger className="flex min-h-32 w-full flex-col bg-primary p-3 py-2 text-primary-foreground">
                <h2>
                  Contributor Prerequisites
                </h2>
                <p className="mb-5">
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
                  {translateCaps('escrow')} ${translateCaps('acceptanceCriteria')}
                </h2>
                <p>
                  For any {translate('escrow')}, you can create a list of pre-defined
                  ${translateCaps('acceptanceCriteria')} that will be preloaded into new {translateCapsPlural("task")}.
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
      </div>
    </div>
  );
}
