import { Card, CardContent } from "~/components/ui/card";

import AssignmentBadges from "~/components/ui/assignment-badges";
import DialogAssignmentLearnerStatus from "~/ui/course/components/assignments/dialogs/DialogAssignmentLearnerStatus";
import { type Assignment, type AssignmentCommitment } from "~/types/db";

export default function PersonalNotesCard({
  currentCommitment,
  assignment,
}: {
  currentCommitment: AssignmentCommitment | undefined;
  assignment: Assignment;
}) {
  if (!!assignment) {
    return (
      <Card>
        <div className="flex flex-row w-full items-center justify-between">
          <div>
            <h2> Personal Assignment Notes</h2>
          </div>
          <div>
            {currentCommitment?.status && (
              <AssignmentBadges status={currentCommitment.status} />
            )}
          </div>
          <div>
            <DialogAssignmentLearnerStatus
              assignmentId={assignment.id}
              assignmentCommitment={currentCommitment}
            />
          </div>
        </div>
        {currentCommitment?.learnerNotes && (
          <CardContent>
            <>
              <>
                <div className="my-2">
                  {currentCommitment.learnerNotes && (
                    <div className="bg-background p-3 text-foreground">
                      <p>{currentCommitment.learnerNotes}</p>
                    </div>
                  )}
                </div>
              </>
            </>
          </CardContent>
        )}
      </Card>
    );
  }
}
