import { type NextPageContext } from "next";
import { Button } from "~/components/ui/button";
import useCourse from "~/hooks/db/course/useCourse";
import useModuleByCourse from "~/hooks/db/course/useModuleByCourse";
import PageCourseAssignmentContent from "~/ui/course/[coursecode]/[modulecode]/assignment/[assignmentcode]/PageCourseAssignmentContent";
import CourseLayout from "~/components/layout/CourseLayout";
import LoadingCircle from "~/ui/studio/components/ContentEditor/ui/icons/loading-circle";

// TODO: Point the Course Creator CTA to on-chain course minting

export default function Page({
  courseCode,
  moduleCode,
}: {
  courseCode: string;
  moduleCode: string;
}) {
  const { courseModule, isLoadingModule } = useModuleByCourse(
    courseCode,
    moduleCode,
  );

  const { course } = useCourse(courseCode)

  if (isLoadingModule) {
    <LoadingCircle />;
  }

  if (!course?.onchainInstance[0]?.CourseCreatorNFTPolicyID) {
    return (

      <CourseLayout>
        <div className="flex flex-col w-1/2 mx-auto my-24 space-y-24 ">
          <h2>

            This course does not have a courseNftPolicyId, so this assignment cannot be displayed to the public.
          </h2>
          <Button>
            CTA: Learn more

          </Button>


        </div>
      </CourseLayout>
    )
  }

  if (courseModule && !!course?.onchainInstance[0]?.CourseCreatorNFTPolicyID) {
    return (
      <PageCourseAssignmentContent
        courseCode={courseCode}
        courseModule={courseModule}
        courseNftPolicyId={course.onchainInstance[0].CourseCreatorNFTPolicyID}
      />
    );
  }
}

Page.getInitialProps = async (ctx: NextPageContext) => {
  const { coursecode, modulecode } = ctx.query;
  return {
    courseCode: coursecode,
    moduleCode: modulecode,
  };
};
