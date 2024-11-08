import { useEscrow } from "~/hooks/contribution/useEscrow";
import DialogEscrow from "~/ui/contribution/dialogs/DialogEscrow";
import DialogPrerequisite from "~/ui/contribution/dialogs/DialogPrerequisite";
import PrerequisiteSelectionManager from "~/ui/contribution/selection/PrerequisiteSelectionManager";
import EscrowAcceptanceCriteriaForm from "~/ui/forms/EscrowAcceptanceCriteriaForm";
import EscrowTaskListComponent from "~/ui/contribution/lists/EscrowTaskListComponent";
import { type Task } from "~/types/db";
import DialogTask from "~/ui/contribution/dialogs/DialogTask";

export default function ManageEscrowComponent({
  escrowCode,
}: {
  escrowCode: string;
}) {
  const { escrow } = useEscrow({ escrowNftPolicyId: escrowCode });

  return (
    <div>
      <div className="mx-auto mb-48 mt-12 grid w-11/12 grid-cols-6 gap-10">
        <div className="col-span-6 mb-12 flex flex-row items-center justify-between">
          <h1 className="text-4xl">{escrow?.title}</h1>
          <div className="space-x-2">
            <DialogEscrow id={escrow?.id} treasuryId={escrow?.treasuryId} />
            {escrow && <DialogTask escrow={escrow} />}
          </div>
        </div>
        <div className="col-span-6 flex w-full">
          <div>
            <h2 className="my-3 text-xl font-bold">
              {escrow?.title} Task List
            </h2>
            {!!escrow?.tasks && (
              <EscrowTaskListComponent tasks={escrow.tasks as Task[]} />
            )}
          </div>
        </div>
        <div className="col-span-3">
          <div>
            <div className="my-2 flex w-full flex-col bg-primary p-3 text-primary-foreground">
              <h2 className="mb-3 text-xl font-bold">
                Contributor Prerequisites
              </h2>
              <p>
                To commit to a task in this Circle, a Contributor must complete
                the following Course prerequisites
              </p>
            </div>
            <div className="p-3">
              {!!escrow?.id && (
                <PrerequisiteSelectionManager escrowId={escrow.id} />
              )}
              <DialogPrerequisite />
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div>
            <div className="my-2 flex w-full flex-col bg-primary p-3 text-primary-foreground">
              <h2 className="mb-3 text-xl font-bold">
                Circle Acceptance Criteria
              </h2>
              <p>
                Your Circle can create a list of pre-defined acceptance criteria
                that will be preloaded into new tasks.
              </p>
            </div>
            <div className="p-3">
              {!!escrow?.id && (
                <EscrowAcceptanceCriteriaForm escrowId={escrow.id} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
