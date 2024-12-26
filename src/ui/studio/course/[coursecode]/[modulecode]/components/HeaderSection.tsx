import {
  type Assignment,
  type Course,
  type Introduction,
  type Lesson,
  type CourseModuleOverview,
  type ModuleSLT,
} from "~/types/db";

import { type FieldValues } from "react-hook-form";
import ControlPanel from "~/ui/studio/course/components/form-sections/ControlPanel";
import CardSLT from "~/ui/studio/course/components/slt/CardSLT";
import { ToggleEditableField } from "~/components/ui/toggle-editable-field";
import ContentEditorMenuBar from "./ContentEditorMenuBar";
import { type Editor } from "@tiptap/react";

type CourseContent = Lesson | Assignment | Introduction;

export default function HeaderSection({
  form,
  course,
  courseModule,
  editContent,
  setEditContent,
  isLoadingUpdate,
  onCancel,
  onSubmit,
  slt,
  courseContent,
  intent,
  setGetLessonPlanDialogOpen,
  editor,
}: {
  form: FieldValues;
  course: Course;
  courseModule: CourseModuleOverview;
  editContent: boolean;
  setEditContent: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingUpdate: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  slt?: ModuleSLT;
  courseContent: CourseContent;
  intent: "lesson" | "assignment" | "introduction";
  setGetLessonPlanDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editor: Editor;
}) {
  if (!course || !courseContent) return;

  let liveContentPath = "";
  // add logic here
  if (intent === "lesson" && slt) {
    liveContentPath = `lesson/${slt.moduleIndex.toString()}`;
  }

  // Fix this one
  if (intent === "assignment") {
    liveContentPath = `assignment/${courseModule.assignments[0]?.assignmentCode}`;
  }

  if (intent === "introduction") {
    liveContentPath = "";
  }

  return (
    <div className="flex flex-col">
      <div className="flex min-h-[40px] flex-row items-center justify-between bg-card p-5">
        <div className="items-center gap-0">
          <ToggleEditableField
            name="title"
            form={form}
            intent="title"
            formTextSize="lg"
            editText={editContent}
            setEditText={setEditContent}
            text={courseContent.title ?? "Edit this lesson title"}
            hasForm={true}
            placeholder="Lesson Title"
          />
          {!editContent && (
            <p className="text-xs tracking-tight text-muted-foreground">
              click title to edit it
            </p>
          )}
        </div>
        {slt && (
          <CardSLT
            moduleCode={courseModule.moduleCode}
            moduleIndex={slt.moduleIndex}
            sltText={slt.sltText}
          />
        )}
        {intent === "assignment" && (
          <div className="gap-1 px-5 py-3">
            <p className="text-right text-2xl font-bold leading-7 text-muted-foreground">
              Assignment for Module {courseModule.moduleCode}
            </p>
            <p className="text-right text-xl font-semibold leading-7">
              {courseModule.assignments[0]?.title}
            </p>
          </div>
        )}
        {intent === "introduction" && (
          <div className="gap-1 px-5 py-3">
            <p className="text-right text-2xl font-bold leading-7 text-muted-foreground">
              Introduction
            </p>
            <p className="text-right text-xl font-semibold leading-7">
              Module {courseModule.moduleCode}:{courseModule.title}
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-row items-center justify-between bg-primary text-primary-foreground">
        <ContentEditorMenuBar
          form={form}
          course={course}
          courseModule={courseModule}
          contentPath={liveContentPath}
          onSubmit={onSubmit}
          setGetLessonPlanDialogOpen={setGetLessonPlanDialogOpen}
          editor={editor}
        />
        <ControlPanel
          editContent={editContent}
          isLoadingUpdate={isLoadingUpdate}
          onCancel={onCancel}
          courseCode={course.courseCode}
          moduleCode={courseModule.moduleCode}
          contentPath={liveContentPath}
          live={courseContent.live}
        />
      </div>
    </div>
  );
}
