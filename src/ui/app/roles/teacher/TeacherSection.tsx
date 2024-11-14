import useCreatorsCoursesPolicies from "~/hooks/onchain/useCreatorsCoursesPolicies";
import CommittedAssignments from "./CommittedAssignments";
import LoadingCircle from "~/ui/studio/components/ContentEditor/ui/icons/loading-circle";
import NetworkModuleManagement from "./NetworkModuleManagement";
import { useState, useEffect } from "react";
import useCourse from "~/hooks/course/useCourse";

export default function TeacherSection({
  accessTokenAlias,
  courseCode,
}: {
  accessTokenAlias: string;
  courseCode: string;
}) {
  const { course } = useCourse(courseCode);
  const { creatorCoursePolicies, isLoadingCreatorCoursePolicies } =
    useCreatorsCoursesPolicies(accessTokenAlias);

  const [isTeacher, setIsTeacher] = useState<boolean>(false);
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

  useEffect(() => {
    if (!!creatorCoursePolicies && !!selectedCoursePolicyId) {
      if (creatorCoursePolicies.includes(selectedCoursePolicyId)) {
        setIsTeacher(true);
      }
    }
  }, [creatorCoursePolicies, selectedCoursePolicyId]);

  if (isLoadingCreatorCoursePolicies) return <LoadingCircle />;

  if (!isTeacher) return null;

  return (
    <div className="mx-auto flex w-11/12 flex-col">
      <NetworkModuleManagement
        courseNftPolicyId={selectedCoursePolicyId ?? ""}
        key={selectedCoursePolicyId ?? 0}
      />

      <CommittedAssignments
        key={selectedCoursePolicyId + "assignments"}
        courseNftPolicy={selectedCoursePolicyId ?? ""}
      />
    </div>
  );
}
