import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { useTerminology } from "~/contexts/terminology-context";
import useProjectByTreasury from "~/hooks/cardano-indexer-api/project/useProjectByTreasury";
import { useEscrowPrerequisites } from "~/hooks/db/contribution/useEscrowPrerequisites";
import DialogPrerequisite from "~/ui/contribution/dialogs/DialogPrerequisite";
import { PrerequisiteItem } from "~/ui/contribution/lists/PrerequisiteList";
import PrerequisiteSelectionManager from "~/ui/contribution/selection/PrerequisiteSelectionManager";

export default function ContributorPrerequisites({ escrowId, treasuryNftPolicyId }: { escrowId: string, treasuryNftPolicyId?: string }) {
  const { translateCaps, translateCapsPlural } = useTerminology()
  const { contributorPolicies } = useProjectByTreasury({ treasuryNftPolicyId: treasuryNftPolicyId ?? "" })

  const { escrowPrerequisites } = useEscrowPrerequisites({ escrowId })

  return (

    <Card>
      <CardHeader>
        <CardTitle>
          Contributor Prerequisites
        </CardTitle>
        <p className="">
          To commit to a task in this {translateCaps('escrow')}, a Contributor must
          complete the following Course {translateCapsPlural('prerequisite')}
        </p>
      </CardHeader>
      <CardContent>
        {!!contributorPolicies ? (
          <div className="flex flex-col p-3 gap-y-4">
            <p>This Project has the Contributor Policy Id</p>
            <pre>{contributorPolicies[0]?.contributorPolicy}</pre>
            <p>This Contribution Opportunity can be earned by completing the following Course Modules:</p>
            {!!escrowPrerequisites[0] &&
              <PrerequisiteItem prerequisite={escrowPrerequisites[0]} />
            }
          </div>
        ) : (
          <div className="p-3">
            {!!escrowId && (
              <PrerequisiteSelectionManager escrowId={escrowId} />
            )}
            <DialogPrerequisite />
          </div>

        )}
      </CardContent>
    </Card>
  )
}
