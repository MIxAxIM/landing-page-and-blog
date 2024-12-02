import Link from "next/link";
import { type CourseModuleOverview } from "~/types/db";

export default function ModuleLayout({
  children,
  courseModule,
  courseCode,
}: {
  children: React.ReactNode;
  courseModule: CourseModuleOverview;
  courseCode: string;
}) {
  return (
    <div>
      <div className="md:5/6 mx-auto flex w-11/12 flex-row justify-between rounded-sm bg-primary px-5 py-2 text-sm font-bold text-primary-foreground lg:w-3/4 lg:text-base">
        <Link
          href={`/course/${courseCode}/${courseModule.moduleCode}`}
          className="hover:text-warning-foreground"
        >
          Intro
        </Link>
        {courseModule.slts.map((s, i) => (
          <Link
            key={i}
            href={`/course/${courseCode}/${courseModule.moduleCode}/lesson/${s.moduleIndex}`}
            className="hover:text-warning-foreground"
          >
            {courseModule.moduleCode}.{s.moduleIndex}
          </Link>
        ))}
        {courseModule.assignments[0] && (
          <Link
            href={`/course/${courseCode}/${courseModule.moduleCode}/assignment/${courseModule.assignments[0]?.assignmentCode}`}
            className="hover:text-warning-foreground"
          >
            Assignment
          </Link>
        )}
      </div>
      <div className="m-10">{children}</div>
    </div>
  );
}
