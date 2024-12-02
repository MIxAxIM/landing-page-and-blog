import { type NextPageContext } from "next";
import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import useCourseByOwner from "~/hooks/db/course/useCourseByOwner";
import useModuleByCourse from "~/hooks/db/course/useModuleByCourse";
import useSLTs from "~/hooks/db/course/useSLTs";
import SideMenu from "~/ui/navigation/SideMenu";
import PageCourseLessonContent from "~/ui/studio/[coursecode]/[modulecode]/lesson/[moduleindex]/PageCourseLessonContent";
import LoadingContentEditor from "~/ui/studio/components/ContentEditor/ui/LoadingContentEditor";
import StudioLayout from "~/ui/studio/components/layout/StudioLayout";

export default function LessonStudioPage({
  courseCode,
  moduleCode,
  moduleIndex,
}: {
  courseCode: string;
  moduleCode: string;
  moduleIndex: string;
}) {
  const sltIndex = parseInt(moduleIndex);
  const { slt, isLoadingSLT } = useSLTs(courseCode, moduleCode, sltIndex);
  const { course, isLoadingCourse } = useCourseByOwner(courseCode);
  const { courseModule, isLoadingModule } = useModuleByCourse(
    courseCode,
    moduleCode,
  );

  if (isLoadingSLT || isLoadingCourse || isLoadingModule) {
    return (
      <div className="flex min-h-screen w-full content-center items-center justify-center">
        <LoadingContentEditor>Loading Lesson</LoadingContentEditor>
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
  if (!slt) {
    return (
      <StudioLayout>
        <h1>No Student Learning Target found at this address</h1>
      </StudioLayout>
    );
  }

  return (
    <DesktopOnlyLayout>
      <SideMenu />
      <PageCourseLessonContent
        course={course}
        courseModule={courseModule}
        moduleIndex={sltIndex}
        slt={slt}
      />
    </DesktopOnlyLayout>
  );
}

LessonStudioPage.getInitialProps = async (ctx: NextPageContext) => {
  const { coursecode, modulecode, moduleindex } = ctx.query;

  return {
    courseCode: coursecode,
    moduleCode: modulecode,
    moduleIndex: moduleindex,
  };
};
