import { useEscrow } from "~/hooks/contribution/useEscrow";
import DialogEscrow from "~/ui/contribution/dialogs/DialogEscrow";
import DialogPrerequisite from "~/ui/contribution/dialogs/DialogPrerequisite";
import PrerequisiteSelectionManager from "~/ui/contribution/selection/PrerequisiteSelectionManager";
import EscrowAcceptanceCriteriaForm from "~/ui/forms/EscrowAcceptanceCriteriaForm";
import EscrowTaskListComponent from "~/ui/contribution/lists/EscrowTaskListComponent";
import { type Task } from "~/types/db";
import DialogTask from "~/ui/contribution/dialogs/DialogTask";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

export default function ManageEscrowComponent({
  escrowCode,
}: {
  escrowCode: string;
}) {
  const { escrow } = useEscrow({ escrowNftPolicyId: escrowCode });

  return (
    <div>
      <div className="mx-auto mb-48 mt-12 grid min-h-[screen] w-11/12 grid-cols-6 gap-10">
        <div className="col-span-6 mb-12 flex flex-row items-center justify-between">
          <h1 className="text-4xl">{escrow?.title}</h1>
          <div className="space-x-2">
            <DialogEscrow id={escrow?.id} treasuryId={escrow?.treasuryId} />
            {!!escrow && (
              <DialogTask escrow={escrow} treasuryId={escrow.treasuryId} />
            )}
          </div>
        </div>
        <div className="col-span-6 flex w-full">
          <div>
            <h2 className="my-3 text-xl font-bold">
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
                <h2 className="my-3 text-xl font-bold">
                  Contributor Prerequisites
                </h2>
                <p className="mb-5">
                  To commit to a task in this Project, a Contributor must
                  complete the following Course prerequisites
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
                <h2 className="my-3 text-xl font-bold">
                  Project Acceptance Criteria
                </h2>
                <p>
                  For any project, you can create a list of pre-defined acceptance
                  criteria that will be preloaded into new tasks.
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
