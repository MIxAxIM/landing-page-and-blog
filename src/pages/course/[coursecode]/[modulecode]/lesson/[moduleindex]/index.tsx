import { type NextPageContext } from "next";
import useModuleByCourse from "~/hooks/db/course/useModuleByCourse";
import PageCourseContent from "~/ui/course/[coursecode]/[modulecode]/lesson/[moduleindex]/PageCourseLessonContent";
import LoadingCircle from "~/ui/studio/components/ContentEditor/ui/icons/loading-circle";

export default function Page({
  courseCode,
  moduleCode,
  moduleIndex,
}: {
  courseCode: string;
  moduleCode: string;
  moduleIndex: string;
}) {
  const { courseModule, isLoadingModule } = useModuleByCourse(
    courseCode,
    moduleCode,
  );

  if (isLoadingModule) {
    <LoadingCircle />;
  }

  if (courseModule) {
    return (
      <PageCourseContent
        courseCode={courseCode}
        courseModule={courseModule}
        moduleIndex={moduleIndex}
      />
    );
  }
}

Page.getInitialProps = async (ctx: NextPageContext) => {
  const { coursecode, modulecode, moduleindex } = ctx.query;
  return {
    courseCode: coursecode,
    moduleCode: modulecode,
    moduleIndex: moduleindex,
  };
};
