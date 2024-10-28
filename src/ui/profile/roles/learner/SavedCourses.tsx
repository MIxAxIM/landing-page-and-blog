import useLearnerSavedCourses from "~/hooks/course/useLearnerSavedCourses";
import { useRouter } from "next/router";
import DashboardSelectMenu from "~/ui/profile/components/DashboardSelectMenu";

export default function SavedCourses() {
  const { courseInfos } = useLearnerSavedCourses();

  const router = useRouter();
  const currentCourseCode = router.query.coursecode as string;

  if (!courseInfos) return;
  return (
    <DashboardSelectMenu
      title="Saved Courses"
      dashboardRoute="dashboard/learner"
      currentItemCode={currentCourseCode}
      courseInfos={courseInfos}
      placeholder="Select a course"
    />
  );
}
