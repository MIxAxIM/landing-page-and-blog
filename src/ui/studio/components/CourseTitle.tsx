import { type Course } from "~/types/db";
import { useSession } from "next-auth/react";
import DialogCourse from "~/ui/studio/components/dialogs/DialogCourse";
import Markdown from "react-markdown";
import DialogCourseDelete from "./dialogs/DialogCourseDelete";
import { useState } from "react";

export default function CourseTitle({ course }: { course: Course }) {
  const { data: sessionData } = useSession();
  const [courseDeleteDialogOpen, setCourseDeleteDialogOpen] =
    useState<boolean>(false);

  if (!course) return;

  const isOwner = course.createdById === sessionData?.user?.creatorId;

  return (
    <>
      <div className="flex min-h-[150px] items-start">
        <div className="flex flex-grow flex-col gap-2">
          <h1>{course.title}</h1>

          <div className="prose dark:prose-invert">
            <Markdown>{course.description}</Markdown>
          </div>
        </div>
        <div className="flex flex-row gap-5">
          {isOwner && <DialogCourse course={course} />}
          {isOwner && (
            <DialogCourseDelete
              courseDeleteDialogOpen={courseDeleteDialogOpen}
              setCourseDeleteDialogOpen={setCourseDeleteDialogOpen}
              courseId={course.id}
            />
          )}
        </div>
      </div>
    </>
  );
}
