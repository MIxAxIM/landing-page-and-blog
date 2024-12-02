import { useRouter } from "next/router";
import useEnrolledCourseList from "~/hooks/cardano-indexer-api/useEnrolledCourseList";
import { type DecodedGlobalStateDatum } from "@andamiojs/datum-utils";
import DashboardSelectMenu from "~/ui/dashboard/components/DashboardSelectMenu";

// currentCourseCode??
// courseList == YOUR TASK

export default function AndamioNetworkCourses({
  globalStateDatum,
}: {
  globalStateDatum: DecodedGlobalStateDatum;
}) {
  const courseNftPolicies = globalStateDatum.TokenInfos.map((t) => t.LsCs);
  const { courseInfos, isLoadingCourseInfos } =
    useEnrolledCourseList(courseNftPolicies);
  const router = useRouter();
  const currentCourseCode = router.query.coursecode as string;

  if (!courseNftPolicies || !courseInfos) return;

  if (isLoadingCourseInfos) return "loading";
  return (
    <DashboardSelectMenu
      title="Enrolled Courses"
      dashboardRoute="dashboard/learner"
      currentItemCode={currentCourseCode}
      courseInfos={courseInfos}
      placeholder="Select a course"
    />
  );
}
