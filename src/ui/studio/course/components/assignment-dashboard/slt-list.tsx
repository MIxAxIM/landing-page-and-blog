import StatusDot from "~/components/ui/status-dot";
import {
  type ModuleSLT,
  type Assignment,
  type CourseModuleOverview,
} from "~/types/db";

export default function SltList({
  courseModule,
  assignment,
}: {
  courseModule: CourseModuleOverview;
  assignment: Assignment;
}) {
  if (!assignment) return;

  interface SltStatus extends ModuleSLT {
    assessed: boolean;
  }
  const statuses: SltStatus[] = [];

  const sortedSlts = courseModule.slts
    .slice()
    .sort((a, b) => a.moduleIndex - b.moduleIndex);

  sortedSlts.forEach((s) => {
    const findSlt = assignment.slts.find((t) => t.id == s.id);

    let assessed = false;
    if (!!findSlt) assessed = true;

    statuses.push({ ...s, assessed });
  });

  return (
    <div className="col-span-4 min-w-[250px] rounded-md border border-secondary-foreground text-sm">
      <div className="flex w-full flex-row justify-between rounded-t-md bg-primary px-3 py-1 text-primary-foreground">
        <p>Student Learning Targets</p>
      </div>
      <div className="px-2 py-1">
        {statuses.map((s: SltStatus) => (
          <p key={s.id} className="">
            <StatusDot status={s.assessed ? "ASSESS" : "SUPPORT"} />{" "}
            {courseModule.moduleCode}.{s.moduleIndex}: {s.sltText}
          </p>
        ))}

        {/* {assignment.slts.map((s) => (
        <p key={s.id} className="">
          <StatusDot status="SUPPORT" /> {module.moduleCode}.{s.moduleIndex}:{" "}
          {s.sltText}
        </p>
      ))} */}
      </div>
      <div className="flex w-full flex-col justify-between rounded-b-md bg-primary px-5 py-1 text-primary-foreground xl:flex-row">
        <p className="text-xs uppercase">
          <StatusDot status="ASSESS" /> Assigment SLT
        </p>
        <p className="text-xs uppercase">
          <StatusDot status="SUPPORT" /> Supporting SLT
        </p>
      </div>
    </div>
  );
}
