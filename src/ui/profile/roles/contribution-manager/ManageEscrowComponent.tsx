import { useEscrow } from "~/hooks/contribution/useEscrow";
import DialogEscrow from "~/ui/contribution/dialogs/DialogEscrow";
import DialogPrerequisite from "~/ui/contribution/dialogs/DialogPrerequisite";
import PlaceholderComponent from "~/ui/prototype/PlaceholderComponent";
import { Badge } from "~/components/ui/badge";

export default function ManageEscrowComponent({
  escrowCode,
}: {
  escrowCode: string;
}) {
  const { escrow } = useEscrow({ escrowNftPolicyId: escrowCode });

  return (
    <div>
      <div className="mx-auto mb-48 mt-12 grid w-11/12 grid-cols-6 gap-3">
        <div className="col-span-6 mb-12 flex flex-row items-center justify-between">
          <h1 className="text-4xl">{escrow?.title}</h1>
          <div className="space-x-2">
            <DialogPrerequisite />
            <DialogEscrow id={escrow?.id} />
          </div>
        </div>
        <div className="col-span-3 row-span-4">
          <PlaceholderComponent name="Task List">
            <div>
              <p>
                Create a general version of task list table to hold these tasks
              </p>
              <pre>{JSON.stringify(escrow?.tasks, null, 2)}</pre>
            </div>
          </PlaceholderComponent>
        </div>
        <div className="col-span-3">
          <PlaceholderComponent name="Define Contributor Prereq">
            <div>Contrib Button</div>
          </PlaceholderComponent>
        </div>
        <div className="col-span-3">
          <PlaceholderComponent name="Add Acceptance Criteria">
            <div>Acceptance Criteria button</div>
          </PlaceholderComponent>
        </div>
        <div className="col-span-3">
          <PlaceholderComponent name="List of Prereqs">
            <div>
              <pre>
                {JSON.stringify(escrow?.contributorPrerequisites, null, 2)}
              </pre>
            </div>
          </PlaceholderComponent>
        </div>
        <div className="col-span-3">
          <PlaceholderComponent name="List of Acceptance Criteria">
            <div>
              <p className="mx-auto mb-3 w-2/3">
                Click Edit Escrow to add default Acceptance Criteria to this
                circle. These will be preloaded by default when a new task is
                created.
              </p>
              {escrow?.savedAcceptanceCriteria?.map((ac, i) => (
                <div
                  key={i}
                  className="mx-auto my-2 flex w-1/2 rounded-sm border border-primary bg-accent p-2 text-lg"
                >
                  {ac}
                </div>
              ))}
            </div>
          </PlaceholderComponent>
        </div>
      </div>
    </div>
  );
}
