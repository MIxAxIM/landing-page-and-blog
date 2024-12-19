// TODO:
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { type Course, type CourseModuleOverview } from "~/types/db";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarCheckboxItem,
} from "~/components/ui/menubar";

import { type FieldValues } from "react-hook-form";
import Link from "next/link";
import { FormControl, FormField, FormItem } from "~/components/ui/form";
import DialogStudioHelp from "~/ui/studio/components/dialogs/DialogStudioHelp";
import DialogAddVideoLink from "~/ui/studio/components/dialogs/DialogAddVideoLink";
import DialogCreatorNotes from "~/ui/studio/components/dialogs/DialogCreatorNotes";
import { type Editor } from "@tiptap/react";

export default function ContentEditorMenuBar({
  form,
  course,
  courseModule,
  contentPath,
  onSubmit,
  setGetLessonPlanDialogOpen,
  editor,
}: {
  form: FieldValues;
  course: Course;
  courseModule: CourseModuleOverview;
  contentPath: string;
  onSubmit: () => void;
  setGetLessonPlanDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editor: Editor;
}) {
  if (!course) return;

  const publishedLink = `/course/${course.courseCode}/${courseModule.moduleCode}/${contentPath}`;

  const handleCheckboxChange = (checked: boolean) => {
    form.setValue("live", checked);
    onSubmit();
  };
  return (
    <>
      <Menubar className="rounded-none border-none bg-primary text-primary-foreground shadow-none">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={onSubmit}>
              Save
              <MenubarShortcut>S</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Import</MenubarItem>
            <MenubarItem>Export</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => editor.commands.undo()}>
              Undo <MenubarShortcut>CTRL-Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={() => editor.commands.redo()}>
              Redo <MenubarShortcut>CTRL-Y</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Publish</MenubarTrigger>
          <MenubarContent>
            <FormField
              control={form.control}
              name="live"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 py-1">
                  <FormControl>
                    <MenubarCheckboxItem
                      checked={field.value}
                      onCheckedChange={handleCheckboxChange}
                    >
                      {field.value ? "Published" : "Publish Content"}
                    </MenubarCheckboxItem>
                  </FormControl>
                </FormItem>
              )}
            />

            <MenubarSeparator />
            <MenubarItem>
              <Link href={publishedLink}>View as Learner</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Navigation</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link
                href={`/studio/${course.courseCode}/${courseModule.moduleCode}/intro`}
              >
                Module {courseModule.moduleCode} Introduction
              </Link>
            </MenubarItem>
            <MenubarItem>
              <Link
                href={`/studio/${course.courseCode}/${courseModule.moduleCode}/assignment/${courseModule.assignments[0]?.assignmentCode}`}
              >
                Assignment {courseModule.assignments[0]?.assignmentCode}
              </Link>
            </MenubarItem>
            <MenubarSeparator />

            {courseModule.slts
              .sort((a, b) => a.moduleIndex - b.moduleIndex)
              .map((s) => (
                <MenubarItem key={s.id}>
                  <Link
                    href={`/studio/${course.courseCode}/${courseModule.moduleCode}/lesson/${s.moduleIndex}`}
                  >
                    Lesson {courseModule.moduleCode}.{s.moduleIndex}
                  </Link>
                </MenubarItem>
              ))}
            <MenubarSeparator />
            <MenubarItem>
              {" "}
              <Link href={`/studio/course/${course.courseCode}`}>Course Page</Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        {/* <MenubarMenu>
              <MenubarTrigger>Go To Module</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Lesson 101.1</MenubarItem>
                <MenubarItem>Lesson 101.2</MenubarItem>
                <MenubarItem>Lesson 101.3</MenubarItem>
              </MenubarContent>
            </MenubarMenu> */}
        {/* <MenubarMenu>
              <MenubarTrigger>Import Lesson</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>From My Course</MenubarItem>
                <MenubarItem>From Andamio Marketplace</MenubarItem>
              </MenubarContent>
            </MenubarMenu> */}

        <MenubarMenu>
          <MenubarTrigger>Andamio AI</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={() => setGetLessonPlanDialogOpen(true)}>
              Get lesson plan
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>
            <Link href={`/studio/course/${course.courseCode}`}>
              Back to Course Outline
            </Link>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Help</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <DialogAddVideoLink form={form} onSubmit={onSubmit} />
        <DialogCreatorNotes form={form} onSubmit={onSubmit} />
        <DialogStudioHelp />
      </Menubar>
    </>
  );
}
