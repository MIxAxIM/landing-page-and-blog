import { Card } from "~/components/ui/card";
import { type Assignment } from "~/types/db";

export default function AssignmentContainer({
  assignment,
}: {
  assignment: Assignment;
}) {
  if (!assignment) return;

  return (
    <Card className="flex flex-row w-11/12 justify-between items-center mx-auto hover:bg-secondary/10">
      <div className="font-bold">
        Assignment {assignment.assignmentCode}
      </div>
      <div className="text-xl">
        {assignment.title}
      </div>
      <div>{assignment.slts.length} SLTs Measured</div>
    </Card>
  );
}

