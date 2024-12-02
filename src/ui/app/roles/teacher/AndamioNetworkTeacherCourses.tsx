import { useRouter } from "next/router";
import useEnrolledCourseList from "~/hooks/cardano-indexer-api/useEnrolledCourseList";
import DashboardSelectMenu from "~/ui/dashboard/components/DashboardSelectMenu";

export default function AndamioNetworkTeacherCourses({
  creatorCoursePolicies,
}: {
  creatorCoursePolicies: string[];
}) {
  const { courseInfos, isLoadingCourseInfos } = useEnrolledCourseList(
    creatorCoursePolicies,
  );
  const router = useRouter();
  const currentCourseCode = router.query.coursecode as string;

  if (!creatorCoursePolicies || !courseInfos) return;

  if (isLoadingCourseInfos) return "loading";
  return (
    <DashboardSelectMenu
      title="Manage Your Courses"
      dashboardRoute="dashboard/teacher"
      currentItemCode={currentCourseCode}
      courseInfos={courseInfos}
      placeholder="Select a course"
    />
  );
}
