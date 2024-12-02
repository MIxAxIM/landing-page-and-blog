import { Button } from "~/components/ui/button";
import MintCourseModuleDialog from "~/components/cardano/dialogs/MintCourseModuleDialog";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import useAssignmentNetworkStatus from "~/hooks/cardano-indexer-api/useAssignmentNetworkStatus";
import { type CourseModuleOverview } from "~/types/db";
import { Badge } from "~/components/ui/badge";
import { useState } from "react";
import Link from "next/link";

export default function CourseModuleAccordionItem({
  courseCode,
  courseNftPolicyId,
  cm,
}: {
  courseCode: string;
  courseNftPolicyId: string;
  cm: CourseModuleOverview;
}) {
  const { isAssignmentOnchain } = useAssignmentNetworkStatus({
    courseCode: courseCode,
    moduleCode: cm.moduleCode,
  });

  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);

  const slts = cm.slts.sort((slt1, slt2) => {
    if (slt1.moduleIndex < slt2.moduleIndex) return -1;
    if (slt1.moduleIndex > slt2.moduleIndex) return 1;
    return 0;
  });

  return (
    <AccordionItem key={courseNftPolicyId + cm.moduleCode} value={cm.moduleCode}>
      <AccordionTrigger
        className={`items-center border-b border-primary p-2 ${isAccordionOpen ? "bg-primary text-primary-foreground" : "bg-background text-foreground"}`}
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
      >
        <div className="grid w-full grid-cols-5 gap-5 text-left">
          <h2>
            <span className="text-sm">Module</span> {cm.moduleCode}
          </h2>
          <div className="text-base col-span-2 h-full flex items-center">
            {cm.title}
          </div>
          <div className="flex h-full flex-row items-center gap-5">
            <p>
              {slts.length} <span className="text-sm">SLTs</span>
            </p>
            <p>
              {slts.length} <span className="text-sm">Lessons</span>
            </p>
          </div>
          {cm.assignments.length > 0 ? (
            <div className="flex h-full flex-row items-center justify-start gap-1 text-left">
              <p>Assignment</p>
              <CheckCircledIcon
                className={`${isAccordionOpen ? "text-success" : "text-green-800"}`}
              />
            </div>
          ) : (
            <div className="flex h-full flex-row items-center justify-start gap-1 text-left">
              <p>No Assignment</p>
            </div>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent className="mb-5 grid grid-cols-1 border-x border-b border-primary px-2 py-2 md:grid-cols-3">
        <div className="col-span-2 flex h-full flex-col" key={courseNftPolicyId + cm.moduleCode}>
          <h3>
            Student Learning Targets (SLTs)
          </h3>
          {slts.map((slt) => (
            <p key={slt.id}>
              <span className="font-mono font-semibold text-primary">
                {cm.moduleCode}.{slt.moduleIndex}:
              </span>{" "}
              {slt.sltText}
            </p>
          ))}
          {cm.assignments?.length > 0 && (
            <>
              <h3>Assignment</h3>
              <p>{cm.assignments[0]?.title}</p>
            </>
          )}
          <div className="mt-5 flex flex-col items-center gap-5 md:flex-row">
            <Link href={`/studio/${cm.originalCourse.courseCode}`}>
              <Button>Edit in Course Studio</Button>
            </Link>
            <Link
              href={`/course/${cm.originalCourse.courseCode}/${cm.moduleCode}`}
            >
              <Button>View Published Module</Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col px-8">
          <Badge
            className={`my-3 ${isAssignmentOnchain ? "bg-success-foreground text-success" : "bg-accent text-black"}`}
          >
            {isAssignmentOnchain
              ? "Module Credential Criteria is Published on Andamio Network"
              : "Module Credential Criteria is not yet published"}
          </Badge>
          {cm.assignments.length === 1 && cm.slts.length > 0 ? (
            <>
              {isAssignmentOnchain ? (
                <div className="flex flex-col gap-2">
                  <Button>Remove Onchain Module</Button>
                  <Button>View Assignment Commitments</Button>
                </div>
              ) : (
                <MintCourseModuleDialog
                  courseModuleOverview={cm}
                  courseNftPolicyId={courseNftPolicyId}
                />
              )}
            </>
          ) : (
            <>
              {cm.assignments.length === 0 && (
                <p>
                  This Module does not have an Assignment. To publish this
                  Module on-chain, please create an Assignment.
                </p>
              )}
              {cm.slts.length === 0 && (
                <p>
                  This Module does not have any Student Learning Targets. To
                  publish a Module on the Andamio Network, it must include at
                  least one SLT.
                </p>
              )}
            </>
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
