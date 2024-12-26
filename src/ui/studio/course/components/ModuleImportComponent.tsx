import { type Course } from "~/types/db";
import DialogImportModule from "./dialogs/DialogImportModule";

export default function ModuleImportComponent({ course }: { course: Course }) {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center gap-10">
      <h2>
        Import a course module to {course?.title}
      </h2>
      {course && (
        <DialogImportModule
          courseId={course.id}
          courseCode={course?.courseCode}
        />
      )}
    </div>
  );
}
