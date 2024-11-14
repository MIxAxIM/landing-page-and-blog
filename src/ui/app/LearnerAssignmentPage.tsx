import { useLearnerAssignmentStatuses } from "~/hooks/course/useLearnerAssignmentStatuses";
import AssignmentsSection from "./roles/learner/AssignmentSection";
import AppLayout from "./layout/AppLayout";

export default function LearnerAssignmentPage() {
  const { learnerAssignments } = useLearnerAssignmentStatuses();

  return (
    <AppLayout>
      <div className="flex w-full flex-col">
        <AssignmentsSection learnerAssignments={learnerAssignments} />
      </div>
    </AppLayout>
  );
}
