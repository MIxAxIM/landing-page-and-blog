import { api } from "~/utils/api";
import Loading from "~/components/loading";
import VideoPlayer from "~/components/media/VideoPlayer";
import { Button } from "~/components/ui/button";
import Link from "~/components/link";
import {
  type CourseVariant,
  type CourseModuleOverview,
  type ModuleSLT,
} from "~/types/db";
import CourseLayout from "../components/layout/CourseLayout";
import { signIn, useSession } from "next-auth/react";
import { useCourseStore } from "~/lib/zustand/course";
import mergeObjects from "~/utils/mergeObjects";
import useCourseVariants from "~/hooks/course/useCourseVariants";
import useCourse from "~/hooks/course/useCourse";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import useCourseById from "~/hooks/course/useCourseById";
import { Badge } from "~/components/ui/badge";
import { format } from "date-fns";
import {
  DocumentTextIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import Metatags from "~/components/site/metatags";
import Markdown from "react-markdown";
import useCourseModuleOverviews from "~/hooks/course/useCourseModuleOverviews";

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
            />
          </div>
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
}: {
  courseCode: string;
  _courseVariant: CourseVariant | undefined;
  learnerLessons: string[];
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
}: {
  module: CourseModuleOverview;
  courseCode: string;
  _courseVariant: CourseVariant | undefined;
  learnerLessons: string[];
}) {
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
  const _module = getModule();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem
        value="item-1"
        className="mb-5 rounded-md border border-primary"
      >
        <AccordionTrigger className="flex w-full items-center justify-between gap-4 rounded-md bg-accent px-5 py-3 text-left hover:bg-card hover:no-underline">
          <span className="text-base font-semibold leading-7">
            {_module.moduleCode}
          </span>
          <span className="grow">
            <div>
              <p className="text-[1.1rem] font-semibold leading-7">
                {_module.title}
              </p>
              <div className="flex items-center gap-x-2 leading-5 text-accent-foreground">
                <p>{_module.description}</p>
              </div>
            </div>
          </span>
          {_module.releaseDate && (
            <Badge>Release Date: {format(_module.releaseDate, "P")}</Badge>
          )}
        </AccordionTrigger>
        <AccordionContent className="flex flex-col flex-wrap items-center justify-between py-5 sm:flex-nowrap">
          <div className="grid w-full grid-cols-4 gap-5 px-5">
            <div className="mx-auto flex w-5/6 flex-col">
              <Link href={`/course/${courseCode}/${_module.moduleCode}`}>
                <Button intent="courseOutlineAction" size="md">
                  Start this Module <DocumentTextIcon width={25} height={25} />
                </Button>
              </Link>
              {_module.assignments[0] && (
                <Link
                  href={`/course/${courseCode}/${_module.moduleCode}/assignment/${_module.assignments[0]?.assignmentCode}`}
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
              {_module.slts.map((slt, i) => (
                <div
                  key={`slt${i}`}
                  className="py-1 hover:text-accent-foreground"
                >
                  <Link
                    href={`/course/${courseCode}/${_module.moduleCode}/lesson/${slt.moduleIndex}`}
                  >
                    <div className="flex w-full flex-row items-center gap-6 font-semibold leading-6">
                      {checkLearnerLesson(
                        slt,
                        _module.lessons,
                        learnerLessons,
                      ) ? (
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-orange-500"></div>
                      )}
                      <div className="max-w-[400px] text-left">
                        <p className="">
                          <span className="text-md font-bold">
                            {_module.moduleCode}.{slt.moduleIndex}
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
