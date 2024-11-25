import { type NextPageContext } from "next";
import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import useAssignment from "~/hooks/course/useAssignment";
import useCourseByOwner from "~/hooks/course/useCourseByOwner";
import useModuleByCourse from "~/hooks/course/useModuleByCourse";
import SideMenu from "~/ui/navigation/SideMenu";
import PageCourseAssignmentContent from "~/ui/studio/[coursecode]/[modulecode]/assignment/[assignmentcode]/PageCourseAssignmentContent";
import LoadingContentEditor from "~/ui/studio/components/ContentEditor/ui/LoadingContentEditor";
import StudioLayout from "~/ui/studio/components/layout/StudioLayout";

export default function AssignmentStudioPage({
  courseCode,
  moduleCode,
}: {
  courseCode: string;
  moduleCode: string;
}) {
  const { assignment, isLoadingAssignment } = useAssignment(
    courseCode,
    moduleCode,
  );
  const { course, isLoadingCourse } = useCourseByOwner(courseCode);
  const { courseModule, isLoadingModule } = useModuleByCourse(
    courseCode,
    moduleCode,
  );

  if (isLoadingAssignment || isLoadingCourse || isLoadingModule) {
    return (
      <div className="flex min-h-screen w-full content-center items-center justify-center">
        <LoadingContentEditor>Loading Assignment Editor</LoadingContentEditor>
      </div>
    );
  }

  // Todo: Extract one component for these, add some style, and improve with interactions.
  if (!course) {
    return (
      <StudioLayout>
        <h1>This Course does not exist. Want to build it?</h1>
      </StudioLayout>
    );
  }
  if (!courseModule) {
    return (
      <StudioLayout>
        <h1>
          There is no Course Module with that Module Code in this Course. Want
          to create it?
        </h1>
      </StudioLayout>
    );
  }
  if (!assignment) {
    return (
      <StudioLayout>
        <h1>This Assignment does not exist. What to create it?</h1>
      </StudioLayout>
    );
  }

  if (course && courseModule && assignment) {
    return (
      <DesktopOnlyLayout>
        <SideMenu />
        <PageCourseAssignmentContent
          course={course}
          courseModule={courseModule}
          assignment={assignment}
        />
      </DesktopOnlyLayout>
    );
  }
}

AssignmentStudioPage.getInitialProps = async (ctx: NextPageContext) => {
  const { coursecode, modulecode, assignmentcode } = ctx.query;

  return {
    courseCode: coursecode,
    moduleCode: modulecode,
    assignmentCode: assignmentcode,
  };
};
