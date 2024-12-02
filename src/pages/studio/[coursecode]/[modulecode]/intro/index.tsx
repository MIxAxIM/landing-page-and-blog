import { type NextPageContext } from "next";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import useCourseByOwner from "~/hooks/db/course/useCourseByOwner";
import useModuleByCourse from "~/hooks/db/course/useModuleByCourse";
import SideMenu from "~/ui/navigation/SideMenu";
import PageModuleIntroContent from "~/ui/studio/[coursecode]/[modulecode]/intro/PageModuleIntroContent";
import LoadingContentEditor from "~/ui/studio/components/ContentEditor/ui/LoadingContentEditor";

interface IntroductionStudioPageProps {
  courseCode: string;
  moduleCode: string;
}

const IntroductionStudioPage = ({
  courseCode,
  moduleCode,
}: IntroductionStudioPageProps) => {
  const { courseModule, isLoadingModule } = useModuleByCourse(
    courseCode,
    moduleCode,
  );
  const { course, isLoadingCourse } = useCourseByOwner(courseCode);

  if (isLoadingCourse || isLoadingModule) {
    return (
      <div className="flex min-h-screen w-full content-center items-center justify-center">
        <LoadingContentEditor>Loading Module Introduction</LoadingContentEditor>
      </div>
    );
  }

  return (
    <DesktopOnlyLayout>
      {!course ? (
        <CourseNotFoundMessage />
      ) : !courseModule ? (
        <ModuleNotFoundMessage />
      ) : (
        <>
          <SideMenu />
          <PageModuleIntroContent course={course} courseModule={courseModule} />
        </>
      )}
    </DesktopOnlyLayout>
  );
};

const CourseNotFoundMessage = () => (
  <h1>This Course does not exist. Want to build it?</h1>
);

const ModuleNotFoundMessage = () => (
  <h1>
    There is no Course Module with that Module Code in this Course. Want to
    create it?
  </h1>
);

IntroductionStudioPage.getInitialProps = async (
  ctx: NextPageContext,
): Promise<IntroductionStudioPageProps> => {
  const { coursecode, modulecode } = ctx.query;

  return {
    courseCode: coursecode as string,
    moduleCode: modulecode as string,
  };
};

export default IntroductionStudioPage;
