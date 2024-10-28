import { useRouter } from "next/router";
import DashboardSelectMenu from "~/ui/profile/components/DashboardSelectMenu";
import useEnrolledCourseList from "~/hooks/onchain/useEnrolledCourseList";
import { type DecodedGlobalStateDatum } from "@andamiojs/datum-utils";

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
