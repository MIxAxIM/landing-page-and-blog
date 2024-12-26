import { type CourseModuleOverview } from "~/types/db";

export default function LessonList({
  module,
}: {
  module: CourseModuleOverview;
}) {
  return (
    <div className="col-span-4 rounded-md border border-secondary-foreground p-3">
      <p>LESSONS</p>
      {module.lessons.map((l) => (
        <p key={l.id}>{l.title}</p>
      ))}
    </div>
  );
}
