import { useOrganizationCourses } from "~/hooks/db/organization/useOrganizationCourses";

export default function CoursesList({ organizationId }: { organizationId: string }) {
  const { courses } = useOrganizationCourses(organizationId);

  return (
    <div>
      <h1>Organization Courses</h1>
      <pre>{JSON.stringify(courses, null, 2)}</pre>
    </div>
  )
}
