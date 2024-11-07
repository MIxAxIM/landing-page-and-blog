import { useEscrow } from "~/hooks/contribution/useEscrow";
import DialogEscrow from "~/ui/contribution/dialogs/DialogEscrow";
import DialogPrerequisite from "~/ui/contribution/dialogs/DialogPrerequisite";
import PlaceholderComponent from "~/ui/prototype/PlaceholderComponent";

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
          <p>policyId: {escrowCode}</p>
          <DialogPrerequisite />
          <DialogEscrow id={escrow?.id} />
        </div>
        <div className="col-span-6">
          <PlaceholderComponent name="Task List">
            <div>
              <pre>{JSON.stringify(escrow?.tasks, null, 2)}</pre>
            </div>
          </PlaceholderComponent>
        </div>
        <div className="col-span-6">
          <PlaceholderComponent name="Define Contributor Prereq">
            <div>Contrib Button</div>
          </PlaceholderComponent>
        </div>
        <div className="col-span-6">
          <PlaceholderComponent name="Add Acceptance Criteria">
            <div>Acceptance Criteria button</div>
          </PlaceholderComponent>
        </div>
        <div className="col-span-6">
          <PlaceholderComponent name="List of Prereqs">
            <div>
              <pre>
                {JSON.stringify(escrow?.contributorPrerequisites, null, 2)}
              </pre>
            </div>
          </PlaceholderComponent>
        </div>
        <div className="col-span-6">
          <PlaceholderComponent name="List of Acceptance Criteria">
            <div>
              <pre>
                {JSON.stringify(escrow?.savedAcceptanceCriteria, null, 2)}
              </pre>
            </div>
          </PlaceholderComponent>
        </div>
      </div>
    </div>
  );
}
