import { useRouter } from "next/router";
import DashboardSelectMenu from "~/ui/profile/components/DashboardSelectMenu";
import useEnrolledCourseList from "~/hooks/onchain/useEnrolledCourseList";

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
