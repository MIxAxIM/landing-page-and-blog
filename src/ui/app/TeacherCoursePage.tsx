import PlaceholderComponent from "../prototype/PlaceholderComponent";
import AppLayout from "./layout/AppLayout";
import CreatorComponent from "./roles/teacher/TeacherCoursePageComponent";

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
