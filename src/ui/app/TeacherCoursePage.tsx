import PlaceholderComponent from "~/components/placeholders/PlaceholderComponent";
import CreatorComponent from "./roles/teacher/TeacherCoursePageComponent";
import AppLayout from "~/components/layout/AppLayout";

export default function TeacherCoursePage({
  courseCode,
}: {
  courseCode?: string;
}) {
  return (
    <AppLayout>
      {courseCode ? (
        <CreatorComponent courseCode={courseCode} />
      ) : (
        <PlaceholderComponent name="teacher landing page" />
      )}
    </AppLayout>
  );
}
