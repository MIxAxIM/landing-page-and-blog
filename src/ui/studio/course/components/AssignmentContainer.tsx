import { type Assignment } from "~/types/db";

export default function AssignmentContainer({
  assignment,
}: {
  assignment: Assignment;
}) {
  if (!assignment) return;

  return (
    <div className="flex justify-between items-center w-11/12 mx-auto px-8 py-2 border-2 border-secondary rounded-md hover:bg-orange-100">
      <div className="font-bold">
        Assignment {assignment.assignmentCode}
      </div>
      <div className="text-xl">
        {assignment.title}
      </div>
      <div>{assignment.slts.length} SLTs Measured</div>
    </div>
  );
}

