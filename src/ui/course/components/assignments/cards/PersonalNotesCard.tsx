import { Card, CardContent, CardHeader } from "~/components/ui/card";

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
      <Card className="border border-primary shadow-md">
        <CardHeader className="flex w-full flex-row items-center justify-between">
          <h2> Personal Assignment Notes</h2>
          {currentCommitment?.status && (
            <AssignmentBadges status={currentCommitment.status} />
          )}
        </CardHeader>
        <CardContent>
          {currentCommitment && (
            <>
              <>
                <div className="my-5">
                  {currentCommitment.learnerNotes && (
                    <div className="bg-background p-3 text-foreground">
                      <p>{currentCommitment.learnerNotes}</p>
                    </div>
                  )}
                </div>
              </>
            </>
          )}
          <div className="flex flex-col justify-center gap-3">
            <DialogAssignmentLearnerStatus
              assignmentId={assignment.id}
              assignmentCommitment={currentCommitment}
            />
          </div>
        </CardContent>
      </Card>
    );
  }
}
