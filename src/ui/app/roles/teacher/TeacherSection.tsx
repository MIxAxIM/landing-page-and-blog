import CommittedAssignments from "./CommittedAssignments";
import NetworkModuleManagement from "./NetworkModuleManagement";
import { useState, useEffect } from "react";
import useCourse from "~/hooks/db/course/useCourse";
import useUserRelationships from "~/hooks/app/useUserRelationships";
import { useAssignmentCommitmentStatusCheck } from "~/hooks/cardano-indexer-api/polling/useAssignmentCommitmentStatusCheck";

export default function TeacherSection({
  accessTokenAlias,
  courseCode,
}: {
  accessTokenAlias: string;
  courseCode: string;
}) {
  const { courses } = useUserRelationships()
  const { course } = useCourse(courseCode);

  const [selectedCoursePolicyId, setSelectedCoursePolicyId] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    if (!!course) {
      setSelectedCoursePolicyId(
        course.onchainInstance[0]?.CourseCreatorNFTPolicyID,
      );
    }
  }, [course]);


  useAssignmentCommitmentStatusCheck(courseCode, selectedCoursePolicyId ?? "")

  //if (!isTeacher) return null;

  return (
    <div className="mx-auto flex w-full flex-col">
      <h2>This should be on the route /app/teach/{course?.courseCode}</h2>
      <h3>{course?.description}</h3>
      <p>On chain instance: {!!course?.onchainInstance ? "yes" : "no"}</p>
      <NetworkModuleManagement
        courseNftPolicyId={selectedCoursePolicyId ?? ""}
      />

      <CommittedAssignments
        key={selectedCoursePolicyId + "assignments"}
        courseNftPolicy={selectedCoursePolicyId ?? ""}
      />
    </div>
  );
}
