import useCourseByPolicyId from "~/hooks/cardano-indexer-api/course/useCourseByPolicyId";
import useCourseModuleOverviews from "~/hooks/db/course/useCourseModuleOverviews";
import { Button } from "~/components/ui/button";
import { Accordion } from "~/components/ui/accordion";
import CourseModuleAccordionItem from "./CourseModuleAccordionItem";

// Logic
// 1. If Module has at least 1 SLT and an Assignment, it can be minted on-chain
// 2. Show mint module button if (1) is true

export default function NetworkModuleManagement({
  courseNftPolicyId,
}: {
  courseNftPolicyId: string;
}) {
  const { courseInfo, assignmentStats } =
    useCourseByPolicyId(courseNftPolicyId);
  const { courseModuleOverviews } = useCourseModuleOverviews(
    courseInfo?.courseCode ?? "",
  );

  return (
    <div className="mx-auto w-full">
      <h2>{courseInfo?.title}</h2>
      <div className="mb-5 flex w-full flex-row items-center justify-between border-b border-accent pb-5">
        <p>{assignmentStats?.courseModules} modules</p>
        <p>
          {assignmentStats?.modulesWithAssignments} modules with assignments
        </p>
        <p>
          {assignmentStats?.networkPublishedModules} modules published on-chain
        </p>
        <Button>Edit in Course Studio</Button>
      </div>
      <h3>Manage Course Modules</h3>
      {courseInfo?.courseCode && (
        <Accordion type="multiple">
          {courseModuleOverviews?.map((cm) => (
            <CourseModuleAccordionItem
              courseCode={courseInfo.courseCode}
              courseNftPolicyId={courseNftPolicyId}
              cm={cm}
              key={courseNftPolicyId + cm.id}
            />
          ))}
        </Accordion>
      )}
    </div>
  );
}
