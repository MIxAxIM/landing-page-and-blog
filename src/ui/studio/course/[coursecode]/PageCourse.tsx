import Loading from "~/components/common/loading";
import StudioLayout from "~/components/layout/StudioLayout";
import CourseTitle from "~/ui/studio/course/components/CourseTitle";
import ListCourseManagers from "~/ui/studio/course/components/ListCourseManagers";
import ListCourseVariants from "../components/ListCourseVariants";

import useCourseByOwner from "~/hooks/db/course/useCourseByOwner";
import ModuleComponent from "../components/ModuleComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Metatags from "~/components/common/metatags";
import ModuleImportComponent from "../components/ModuleImportComponent";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import TeacherSection from "../components/TeacherSection";

export default function PageCourse({ courseCode }: { courseCode: string }) {
  const { accessTokenAlias } = useAccessToken();
  const { course, isLoadingCourse } = useCourseByOwner(courseCode);
  //  const [selectedVariant, setSelectedVariant] = useState<
  //  CourseVariant | undefined
  //>(undefined);


  return (
    <StudioLayout>
      <>
        {course ? (
          <>
            <Metatags title={course.title} />
            <div className="flex flex-col gap-4 sm:mx-auto w-11/12">
              <CourseTitle course={course} />
              <Tabs defaultValue="modules">
                <TabsList className="my-3 w-full">
                  <TabsTrigger value="modules" className="px-10">
                    Modules
                  </TabsTrigger>
                  <TabsTrigger value="managers" className="px-10">
                    Course Contributors
                  </TabsTrigger>
                  <TabsTrigger value="variants" className="px-10">
                    Variants
                  </TabsTrigger>
                  <TabsTrigger value="onchain" className="px-10">
                    Manage Published Course and Credentials
                  </TabsTrigger>
                  <TabsTrigger value="import" className="px-10">
                    Import
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="modules">
                  <ModuleComponent course={course} />
                </TabsContent>
                <TabsContent value="managers">
                  <ListCourseManagers course={course} />
                </TabsContent>
                <TabsContent value="variants">
                  <ListCourseVariants course={course} />
                </TabsContent>
                <TabsContent value="onchain">
                  {!!accessTokenAlias && (
                    <>
                      <TeacherSection
                        courseCode={course.courseCode}
                      />
                    </>
                  )}
                </TabsContent>
                <TabsContent value="import">
                  <ModuleImportComponent course={course} />
                </TabsContent>
              </Tabs>
            </div>
          </>
        ) : (
          isLoadingCourse && (
            <div className="flex min-h-[90vh] items-center">
              <Loading size={50} />
            </div>
          )
        )}
      </>
    </StudioLayout>
  );
}
