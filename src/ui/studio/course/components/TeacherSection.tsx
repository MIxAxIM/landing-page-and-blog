import CommittedAssignments from "./CommittedAssignments";
import NetworkModuleManagement from "./NetworkModuleManagement";
import useCourse from "~/hooks/db/course/useCourse";
import { useAssignmentCommitmentStatusCheck } from "~/hooks/cardano-indexer-api/polling/useAssignmentCommitmentStatusCheck";

export default function TeacherSection({
  courseCode,
}: {
  courseCode: string;
}) {
  const { course } = useCourse(courseCode);

  useAssignmentCommitmentStatusCheck(courseCode, course?.courseNftPolicyId ?? "")

  return (
    <div className="mx-auto flex w-full flex-col" key={courseCode}>
      <h3>{course?.description}</h3>
      <NetworkModuleManagement
        courseNftPolicyId={course?.courseNftPolicyId ?? ""}
      />

      <CommittedAssignments
        key={course?.courseNftPolicyId + "assignments"}
        courseNftPolicy={course?.courseNftPolicyId ?? ""}
      />
    </div>
  );
}
