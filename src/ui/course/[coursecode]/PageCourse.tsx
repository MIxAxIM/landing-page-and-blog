import { api } from "~/utils/api";
import Loading from "~/components/common/loading";
import VideoPlayer from "~/components/media/VideoPlayer";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {
  type CourseVariant,
  type CourseModuleOverview,
  type ModuleSLT,
} from "~/types/db";
import { signIn, useSession } from "next-auth/react";
import { useCourseStore } from "~/lib/zustand/course";
import mergeObjects from "~/utils/mergeObjects";
import useCourseVariants from "~/hooks/db/course/useCourseVariants";
import useCourse from "~/hooks/db/course/useCourse";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import useCourseById from "~/hooks/db/course/useCourseById";
import { Badge } from "~/components/ui/badge";
import { format } from "date-fns";
import {
  DocumentTextIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import Metatags from "~/components/common/metatags";
import Markdown from "react-markdown";
import useCourseModuleOverviews from "~/hooks/db/course/useCourseModuleOverviews";
import { useState } from "react";
import useAssignmentNetworkStatus from "~/hooks/cardano-indexer-api/course/useAssignmentNetworkStatus";
import CourseLayout from "~/components/layout/CourseLayout";
import CourseDetails from "~/ui/app/roles/learner/CourseDetails";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import useGlobalStateDatum from "~/hooks/cardano-indexer-api/network/useGlobalStateDatum";
import { useLearnerAssignmentStatuses } from "~/hooks/db/course/useLearnerAssignmentStatuses";

export default function PageCourse({
  courseCode,
  courseId,
}: {
  courseCode?: string;
  courseId?: string;
}) {
  const { data: sessionData } = useSession();

  const learnerLessons = sessionData?.user.lessonIds;

  const { course: courseById } = useCourseById(courseId);
  const { course: courseByCode } = useCourse(courseCode);

  const { accessTokenAlias } = useAccessToken();
  const { globalStateDatum } = useGlobalStateDatum(accessTokenAlias ?? "");
  const { learnerAssignments } = useLearnerAssignmentStatuses();

  const course = courseById ?? courseByCode;

  const { selectedCourseVariant } = useCourseVariants(course?.id);

  const setCourseVariant = useCourseStore((state) => state.setCourseVariant);

  if (course === null) {
    return <Loading />;
  }

  const _courseCode = courseCode ?? course?.courseCode;

  function getCourse() {
    let _courseVariant = undefined;

    if (selectedCourseVariant) {
      _courseVariant = selectedCourseVariant;
      setCourseVariant(selectedCourseVariant);
    } else {
      setCourseVariant(undefined);
    }

    const _currentCourseVariant: Record<string, any> = mergeObjects(
      _courseVariant,
      course,
    );

    return { _currentCourseVariant, _courseVariant };
  }
  const { _currentCourseVariant, _courseVariant } = getCourse();

  if (_currentCourseVariant === undefined) return <></>;

  if (_currentCourseVariant === null) {
    return (
      <CourseLayout>
        <h1>Course not found</h1>
      </CourseLayout>
    );
  }

  return (
    <CourseLayout>
      <Metatags title={_currentCourseVariant.title} />
      <div className="mx-auto flex w-3/4 max-w-5xl flex-col">
        <h1>
          {_currentCourseVariant.title}
        </h1>
        <div className="prose py-10 text-xl leading-8 dark:prose-invert">
          <Markdown>{_currentCourseVariant.description}</Markdown>
        </div>
        <div className="grid grid-cols-1 gap-5 lg:gap-10">
          <div>
            {_currentCourseVariant.videoUrl && (
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="grow">
                  <VideoPlayer videoId={_currentCourseVariant.videoUrl} />
                </div>
              </div>
            )}

            {!sessionData && (
              <div className="flex basis-1/3 flex-col gap-4">
                <div className="grow">
                  <Button
                    onClick={() => {
                      void signIn(undefined, {
                        callbackUrl: `/course/${_courseCode}`,
                      });
                    }}
                  >
                    Start Course
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div>
            <h1>Course Outline</h1>
            <p className="mb-5 mt-3 font-bold">
              Click a Module to view Student Learning Targets
            </p>
            <ListModules
              courseCode={_currentCourseVariant.courseCode}
              _courseVariant={_courseVariant}
              learnerLessons={learnerLessons ? learnerLessons : []}
              courseNftPolicyId={_currentCourseVariant.courseNftPolicyId}
            />
          </div>
          {courseCode && (
            <CourseDetails
              globalStateDatum={globalStateDatum}
              currentCourseCode={courseCode}
              learnerAssignments={learnerAssignments}
            />
          )}
        </div>

        {/* <div className="flex gap-4">
          {listCourseVariant?.map((variant) => (
            <button
              key={variant.name}
              onClick={() => {
                setSelectedVariantName(variant.value);
              }}
            >
              {variant.name}
            </button>
          ))}
        </div> */}
      </div>
    </CourseLayout>
  );
}

function ListModules({
  courseCode,
  _courseVariant,
  learnerLessons,
  courseNftPolicyId,
}: {
  courseCode: string;
  _courseVariant: CourseVariant | undefined;
  learnerLessons: string[];
  courseNftPolicyId: string;
}) {
  const { courseModuleOverviews, isLoadingCourseModules } =
    useCourseModuleOverviews(courseCode);

  function sortBy(a: CourseModuleOverview, b: CourseModuleOverview) {
    return a.moduleCode > b.moduleCode ? 1 : -1;
  }

  if (courseModuleOverviews == undefined) return <></>;

  return (
    <>
      {isLoadingCourseModules && <Loading />}
      {courseModuleOverviews.sort(sortBy).map((module, i) => (
        <ModuleContainer
          key={i}
          module={module}
          courseCode={courseCode}
          _courseVariant={_courseVariant}
          learnerLessons={learnerLessons}
          courseNftPolicyId={courseNftPolicyId}
        />
      ))}
    </>
  );
}

function ModuleContainer({
  module,
  courseCode,
  _courseVariant,
  learnerLessons,
  courseNftPolicyId,
}: {
  module: CourseModuleOverview;
  courseCode: string;
  _courseVariant: CourseVariant | undefined;
  learnerLessons: string[];
  courseNftPolicyId: string;
}) {
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);
  const { isAssignmentOnchain } = useAssignmentNetworkStatus({
    courseCode: courseCode,
    moduleCode: module.moduleCode,
    courseNftPolicyId: courseNftPolicyId,
  });
  // Todo: When ready to implement variants, we can change this to a useModuleVariants hook:
  const { data: moduleVariants } = api.moduleVariant.getModuleVariants.useQuery(
    {
      moduleId: module.id,
    },
  );

  function getModule() {
    let _module = module;

    if (_courseVariant && moduleVariants) {
      const _moduleVariant = moduleVariants.find(
        (v) => v.courseVariant.id === _courseVariant.id,
      );

      if (_courseVariant) {
        //@ts-expect-error todo merging need improvement
        _module = mergeObjects(_moduleVariant, _module);
      }
    }

    return _module;
  }
  const currentModule = getModule();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value={currentModule.moduleCode}
        className="my-3 w-full sm:mx-auto sm:w-[630px] md:w-[750px] lg:w-[800px] xl:w-[950px] 2xl:w-[1100px] bg-primary rounded-md"
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
      >
        <AccordionTrigger
          className={`flex w-full flex-row justify-between mb-0 ${isAccordionOpen ? "rounded-t-md" : "rounded-md"} h-full min-h-[75px] items-center bg-primary px-3 text-primary-foreground`}
        >
          <div className="grid w-full grid-cols-12 py-1">
            <div className="col-span-1 flex h-full items-center">
              {currentModule.moduleCode}
            </div>
            <div className="col-span-3 flex h-full items-center">
              <div className="flex h-full  items-center gap-2 text-left">
                <span>{currentModule.title}</span>
              </div>
            </div>
            <div className="col-span-3 flex h-full items-center">{`${currentModule.slts.length} SLTs + ${currentModule.lessons.length} Lessons`}</div>
            <div className="col-start-12 flex h-full items-center justify-center">
              <div
                className="flex content-end items-center justify-end gap-2 px-5"
                onClick={(e) => e.stopPropagation()}
              >
                {isAssignmentOnchain && "credential available"}
              </div>
            </div>
          </div>
          {currentModule.releaseDate && (
            <Badge>Release Date: {format(currentModule.releaseDate, "P")}</Badge>
          )}
        </AccordionTrigger>
        <AccordionContent className="flex flex-col flex-wrap items-center justify-between py-5 sm:flex-nowrap bg-background border-x border-b border-primary rounded-b-md">
          <div className="grid w-full grid-cols-4 gap-5 px-5">
            <div className="mx-auto flex w-5/6 flex-col">
              <Link href={`/course/${courseCode}/${currentModule.moduleCode}`}>
                <Button intent="courseOutlineAction" size="md">
                  Start this Module <DocumentTextIcon width={25} height={25} />
                </Button>
              </Link>
              {currentModule.assignments[0] && (
                <Link
                  href={`/course/${courseCode}/${currentModule.moduleCode}/assignment/${currentModule.assignments[0]?.assignmentCode}`}
                >
                  <Button intent="courseOutlineAction" size="md">
                    View Assignment <DocumentCheckIcon width={25} height={25} />
                  </Button>
                </Link>
              )}
            </div>
            <div className="col-span-3">
              <h2>
                Student Learning Targets
              </h2>
              {currentModule.slts.map((slt, i) => (
                <div
                  key={`slt${i}`}
                  className="py-1"
                >
                  <Link
                    href={`/course/${courseCode}/${currentModule.moduleCode}/lesson/${slt.moduleIndex}`}
                  >
                    <div className="flex w-full flex-row items-center gap-6 font-semibold leading-6">
                      {checkLearnerLesson(
                        slt,
                        currentModule.lessons,
                        learnerLessons,
                      ) ? (
                        <div className="h-2 w-2 rounded-full bg-green-500 hover:bg-primary"></div>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-orange-500 hover:bg-primary"></div>
                      )}
                      <div className="max-w-[400px] text-left hover:text-primary">
                        <p className="">
                          <span className="text-md font-bold">
                            {currentModule.moduleCode}.{slt.moduleIndex}
                          </span>
                          {": "}
                          <span className="text-md">{slt.sltText}</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function checkLearnerLesson(
  slt: ModuleSLT,
  lessons: {
    id: string;
    title: string | null;
    live: boolean | null;
    sltId: string;
  }[],
  learnerLessons: string[],
) {
  const _currentLesson = lessons.find((l) => l.sltId === slt.id);
  if (_currentLesson) {
    return learnerLessons.includes(_currentLesson.id);
  }

  return false;
}
