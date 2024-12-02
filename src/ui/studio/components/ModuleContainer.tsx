import { useCallback, useEffect, useState } from "react";
import {
  type Course,
  type CourseModuleOverview,
  type ModuleSLT,
} from "~/types/db";
import DialogAssignment from "./dialogs/DialogAssignment";
import DialogSLT from "./dialogs/DialogSLT";
import { SortableSLT } from "./slt/RowSLT";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

import { DndContext, closestCenter, type Active } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import AssignmentContainer from "./AssignmentContainer";
import Link from "next/link";
import DialogModule from "./dialogs/DialogModule";
import IntroductionContainer from "./IntroductionContainer";
import useSLTs from "~/hooks/db/course/useSLTs";
import { format } from "date-fns";
import LoadingCircle from "./ContentEditor/ui/icons/loading-circle";
import useAssignment from "~/hooks/db/course/useAssignment";
import { type Slt } from "@prisma/client";
import useAssignmentNetworkStatus from "~/hooks/cardano-indexer-api/useAssignmentNetworkStatus";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import LoadingCard from "~/components/common/LoadingCard";

type sltI = { slt: ModuleSLT; sltIndex: number; id: string };

export default function ModuleContainer({
  currentModule,
  course,
  // variants,
}: {
  currentModule: CourseModuleOverview;
  course: Course;
  // variants?: ModuleVariant[];
}) {
  const ctx = api.useUtils();

  const checkContentPublished =
    !currentModule.lessons.some((l) => !l.live) &&
    currentModule.introduction?.live &&
    !currentModule.assignments.some((a) => !a.live);

  const [isContentPublished, setIsContentPublished] = useState<boolean>(
    !!checkContentPublished ?? false,
  );

  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);
  const [moduleDialogOpen, setModuleDialogOpen] = useState<boolean>(false);

  const [sltDialogOpen, setSltDialogOpen] = useState<boolean>(false);
  const [assignmentDialogOpen, setAssignmentDialogOpen] =
    useState<boolean>(false);

  const [sltIndexes, setSltIndexes] = useState<sltI[]>([]);
  const [orderChanged, setOrderChanged] = useState<boolean>(false);

  const [activeSLT, setActiveSLT] = useState<Active | null>(null);

  const { assignment, isLoadingAssignment } = useAssignment(
    course?.courseCode ?? "",
    currentModule.moduleCode,
  );

  const { moduleSLTs, isLoadingModuleSLTs, isFetchedModuleSLTs } = useSLTs(
    course?.courseCode ?? "",
    currentModule.moduleCode,
  );

  // TODO: It is inefficient to make this query for individual Course Modules. Consider how to add on-chain status to DB for better performance
  const { isAssignmentOnchain } = useAssignmentNetworkStatus({
    courseCode: course?.courseCode ?? "",
    moduleCode: currentModule.moduleCode,
  });

  const { mutate: publishModuleContent, isLoading: isLoadingPublish } =
    api.module.publishModuleContent.useMutation({
      onSuccess: () => {
        void ctx.module.getCourseModuleOverviews.invalidate({
          courseCode: course?.courseCode,
        });
        toast.success("Content is published");
        setIsContentPublished(true);
      },
      onError: (e) => {
        console.log(e)
        toast.error("Could not publish content");
      },
    });

  const { mutate: updateSltIndexes, isLoading: isLoadingIndexUpdate } =
    api.slt.updateModuleIndexes.useMutation({
      onSuccess: () => {
        void ctx.module.getCourseModuleOverviews.invalidate({
          courseCode: course?.courseCode,
        });
        void ctx.slt.getModuleSLTs.invalidate({
          courseCode: course?.courseCode,
          moduleCode: currentModule.moduleCode,
        });
        setActiveSLT(null);
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        if (errorMessage) {
          toast.error("Some SLT inputs are missing or invalid");
        } else {
          toast.error("SLT ID taken. Please try again.");
        }
      },
      onSettled: () => {
        toast.success("Updated ordering");
      },
    });
  // Todo - implement the rest of dnd-kit
  // How does this help?
  // Figure out how to only invoke dnd when hamburger is touched
  // const activeItem = useMemo(
  //  () => sltIndexes.find((s) => s.slt.id === activeSLT?.id),
  //  [activeSLT, sltIndexes],
  // );

  // Todo = Variant Epic: This logic doesn't work - we get the same variant tab on each module.
  // However, the problem is more than this - module variants are not updating correctly.
  // const tabs = [{ name: "Student Learning Targets", value: "main" }];
  // if (variants) {
  //   variants.forEach((v) => {
  //     const _tab = { name: v.title, value: v.title };
  //     tabs.push(_tab);
  //   });
  // }

  const onDragEnd = (event: { active: any; over: any }) => {
    const { active, over }: { active: { id: string }; over: { id: string } } =
      event;
    if (active.id === over.id) {
      return;
    }

    setSltIndexes((slts) => {
      const activeSLT = sltIndexes.findIndex((s) => s.slt.id === active.id);
      const overIndex = sltIndexes.findIndex((s) => s.slt.id === over.id);
      return arrayMove(slts, activeSLT, overIndex);
    });

    setOrderChanged(true);
  };

  const onUpdateSltList = useCallback(() => {
    const _updateSlts: { id: string; moduleIndex: number }[] = [];
    sltIndexes.forEach((s, i) => {
      _updateSlts.push({ id: s.slt.id, moduleIndex: i + 1 });
    });

    updateSltIndexes(_updateSlts);
  }, [sltIndexes, updateSltIndexes]);

  useEffect(() => {
    if (orderChanged) {
      onUpdateSltList();
      setOrderChanged(false);
    }
  }, [sltIndexes, orderChanged, onUpdateSltList]);

  // Todo: "Autosave"
  // Implement delay logic so that save doesn't happen right away

  useEffect(() => {
    const _slts: sltI[] = [];

    if (moduleSLTs) {
      moduleSLTs.forEach((slt: Slt) => {
        _slts.push({ slt: slt, sltIndex: slt.moduleIndex, id: slt.id });
      });

      const sortedSlts = _slts.slice().sort((a, b) => a.sltIndex - b.sltIndex);
      setSltIndexes(sortedSlts);
    }
  }, [moduleSLTs, isFetchedModuleSLTs]);

  if (isLoadingModuleSLTs) {
    return <LoadingCard>Loading SLTs</LoadingCard>;
  }

  return (
    <div
      className="my-3 w-full sm:mx-auto sm:w-[630px] md:w-[750px] lg:w-[800px] xl:w-[950px] 2xl:w-[1100px] bg-primary rounded-md"
      key={`${course?.courseCode}-${currentModule.moduleCode}`}
    >
      <AccordionItem
        value={currentModule.moduleCode}
        disabled={moduleDialogOpen}
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
                className="flex content-end items-center justify-end gap-2 px-2"
                onClick={(e) => e.stopPropagation()}
              >
                {isAssignmentOnchain ? (
                  <LockClosedIcon />
                ) : (
                  <DialogModule
                    moduleDialogOpen={moduleDialogOpen}
                    setModuleDialogOpen={setModuleDialogOpen}
                    course={course}
                    moduleCode={currentModule.moduleCode}
                  />
                )}
              </div>
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="mt-0 border-b border-x border-primary rounded-b-md flex flex-col bg-gradient-to-br from-background to-sky-100">
          <IntroductionContainer
            courseCode={course?.courseCode ?? ""}
            moduleCode={currentModule.moduleCode}
          />

          <DndContext
            collisionDetection={closestCenter}
            onDragStart={({ active }) => {
              setActiveSLT(active);
            }}
            onDragEnd={onDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={sltIndexes}
              strategy={verticalListSortingStrategy}
            >
              {sltIndexes.map((sI) => (
                <SortableSLT
                  slt={sI.slt}
                  module={currentModule}
                  courseCode={course?.courseCode ?? ""}
                  key={sI.slt.id}
                  published={isAssignmentOnchain ?? false}
                />
              ))}
            </SortableContext>
            {/* todo implelment the rest of dnd-kit - look at codesandbox example - can imagine extracting this component and adding overlay */}
          </DndContext>
          {isLoadingAssignment ? (
            <LoadingCircle />
          ) : (
            <>
              {assignment && (
                <Link
                  href={`/studio/${course?.courseCode}/${currentModule.moduleCode}/assignment/${assignment.assignmentCode}`}
                >
                  <AssignmentContainer assignment={assignment} />
                </Link>
              )}
            </>
          )}
          {isAssignmentOnchain ? (
            <div className="mx-auto my-5 flex w-11/12 flex-row items-center">
              <p>
                This Module is published on the Andamio Network. You cannot
                change the title of the Module or the Student Learning Targets.
                You can still update the introduction, lesson, and assignment
                content. To manage this module, navigate to the{" "}
                <Link href="/app/teach">
                  <span className="font-semibold text-primary over:text-success">
                    Andamio App
                  </span>
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 mx-auto w-full items-center bg-accent py-3 mt-8 rounded-b-md">
              <div className="flex w-full justify-center">
                <DialogSLT
                  sltDialogOpen={sltDialogOpen}
                  setSltDialogOpen={setSltDialogOpen}
                  courseCode={course?.courseCode ?? ""}
                  currentModule={currentModule}
                />
              </div>
              <div className="flex w-full justify-center">
                <DialogAssignment
                  assignmentDialogOpen={assignmentDialogOpen}
                  setAssignmentDialogOpen={setAssignmentDialogOpen}
                  courseCode={course?.courseCode ?? ""}
                  courseModule={currentModule}
                  assignment={assignment}
                />
              </div>
              {isContentPublished ? (
                <div className="flex w-full justify-center">
                  <p>
                    All Content is Live at{" "}
                    <Link
                      href={`/course/${course?.courseCode}/${currentModule.moduleCode}`}
                      className="cursor-pointer font-semibold text-primary"
                    >
                      andamio.io/course/{course?.courseCode}/
                      {currentModule.moduleCode}
                    </Link>
                  </p>
                </div>
              ) : (
                <div className="flex w-full justify-center">
                  {isLoadingPublish ? (
                    <p>publishing all module content...</p>
                  ) : (
                    <>
                      <Button
                        intent="dialog"
                        size="dialog"
                        onClick={() =>
                          publishModuleContent({ moduleId: currentModule.id })
                        }
                      >
                        Publish Module Content
                      </Button>
                      {currentModule.releaseDate && (
                        <p className="mt-3">
                          This Module is scheduled for release on{" "}
                          {format(currentModule.releaseDate, "PPPP")}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          {(activeSLT ?? isLoadingIndexUpdate) && (
            <div className="flex h-8 w-full rounded-b-md bg-amber-500" />
          )}
        </AccordionContent>
      </AccordionItem>
    </div>
  );
}
