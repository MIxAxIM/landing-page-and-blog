import useCreatorsCoursesPolicies from "~/hooks/onchain/useCreatorsCoursesPolicies";
import CommittedAssignments from "./CommittedAssignments";
import LoadingCircle from "~/ui/studio/components/ContentEditor/ui/icons/loading-circle";
import NetworkModuleManagement from "./NetworkModuleManagement";
import { useState, useEffect } from "react";
import useCourse from "~/hooks/course/useCourse";
import useUserRelationships from "~/hooks/app/useUserRelationships";

export default function TeacherSection({
  accessTokenAlias,
  courseCode,
}: {
  accessTokenAlias: string;
  courseCode: string;
}) {
  const { courses } = useUserRelationships()
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

  //if (!isTeacher) return null;

  return (
    <div className="mx-auto flex w-full flex-col">
      <h1>Here is an example of course details</h1>
      <h2>This should be on the route /app/teach/{course?.courseCode}</h2>
      <h3>{course?.description}</h3>
      <p>On chain instance: {!!course?.onchainInstance ? "yes" : "no"}</p>
      <pre>{JSON.stringify(course, null, 2)}</pre>
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
