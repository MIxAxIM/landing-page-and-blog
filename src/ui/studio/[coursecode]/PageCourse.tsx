import { useState } from "react";
import Loading from "~/components/common/loading";
import StudioLayout from "~/components/layout/StudioLayout";
import CourseTitle from "~/ui/studio/components/CourseTitle";
import ListCourseManagers from "~/ui/studio/components/ListCourseManagers";
import ListCourseVariants from "../components/ListCourseVariants";

import useCourseByOwner from "~/hooks/db/course/useCourseByOwner";
import ShowCourseOnchain from "../components/ShowCourseOnchain";
import { Network } from "@prisma/client";
import FormFieldset from "~/components/form/form-fieldset";
// import { type CourseVariant } from "~/types/db";
import ModuleComponent from "../components/ModuleComponent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Metatags from "~/components/common/metatags";
import ModuleImportComponent from "../components/ModuleImportComponent";
import SelectNetwork from "~/components/cardano/common/SelectNetwork";

export default function PageCourse({ courseCode }: { courseCode: string }) {
  const { course, isLoadingCourse } = useCourseByOwner(courseCode);
  const [selectedNetwork, setSelectedNetwork] = useState<Network>("PREPROD");
  //  const [selectedVariant, setSelectedVariant] = useState<
  //  CourseVariant | undefined
  //>(undefined);

  const handleNetworkSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const _network = event.target.value as Network;
    setSelectedNetwork(_network);
  };

  return (
    <StudioLayout>
      <>
        {course ? (
          <>
            <Metatags title={course.title} />
            <div className="flex flex-col gap-4 sm:mx-auto sm:w-[630px] md:w-[750px] lg:w-[800px] xl:w-[950px] 2xl:w-[1100px]">
              <CourseTitle course={course} />
              <Tabs defaultValue="modules">
                <TabsList className="my-3 w-full rounded-md border border-secondary-foreground">
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
                    Andamio Network Configuration
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
                  <ShowCourseOnchain
                    key={selectedNetwork + course.id}
                    course={course}
                    network={selectedNetwork}
                  />
                </TabsContent>
                <TabsContent value="import">
                  <ModuleImportComponent course={course} />
                </TabsContent>
              </Tabs>
              <div className="mt-10 flex w-full flex-row justify-between">
                <FormFieldset label="Network">
                  <SelectNetwork
                    name="network"
                    onChange={handleNetworkSelectionChange}
                    options={Object.keys(Network).map((type) => ({
                      value: type,
                      label: type,
                    }))}
                  />
                </FormFieldset>
              </div>
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
