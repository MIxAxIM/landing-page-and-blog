import {
  type DecodedTokenInfo,
  type DecodedCourseStateDatum,
} from "@andamiojs/datum-utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "~/components/ui/accordion";
import AssignmentBadges from "~/components/ui/assignment-badges";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "~/components/ui/tooltip";
import useAssignmentDatums from "~/hooks/onchain/useAssignmentDatums";
import useAssignmentNetworkStatus from "~/hooks/onchain/useAssignmentNetworkStatus";
import {
  type CourseModuleWithAssignmentSummary,
  type AssignmentCommitment,
} from "~/types/db";

export default function LearnerCourseModuleDetailsComponent({
  alias,
  courseModule,
  courseStateDatum,
  courseTokenInfo,
  learnerCourseStatus,
}: {
  alias: string;
  courseModule: CourseModuleWithAssignmentSummary;
  courseStateDatum: DecodedCourseStateDatum | undefined;
  courseTokenInfo: DecodedTokenInfo | undefined;
  learnerCourseStatus: "NEVER_ENROLLED" | "ENROLLED" | "WAS_ENROLLED";
}) {
  const { data: sessionData } = useSession();
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);
  const [learnerModuleStatus, setLearnerModuleStatus] = useState<
    | "NEVER_COMMITTED"
    | "CURRENTLY_COMMITTED"
    | "COMPLETED_COMMITMENT"
    | "NO_ASSIGNMENT"
    | "NO_NETWORK_CREDENTIAL"
  >("NEVER_COMMITTED");

  const { isAssignmentOnchain } = useAssignmentNetworkStatus({
    courseCode: courseModule.originalCourse.courseCode,
    moduleCode: courseModule.moduleCode,
  });

  const { assignmentDatum } = useAssignmentDatums(
    courseTokenInfo?.LsCs ?? "",
    alias,
  );

  const [assignmentCommitment, setAssignmentCommitment] = useState<
    AssignmentCommitment | undefined
  >(undefined);

  const [credentialColor, setCredentialColor] = useState<string>(
    "bg-gray-800 text-white",
  );

  useEffect(() => {
    if (sessionData && courseModule) {
      const _assignment = sessionData.user.assignmentCommitments.find(
        (a) => a.assignmentId === courseModule.assignments[0]?.id,
      );
      if (_assignment) {
        setAssignmentCommitment(_assignment);
      }
    }
  }, [sessionData, courseModule]);

  useEffect(() => {
    if (learnerCourseStatus === "ENROLLED" && !!courseStateDatum) {
      setCredentialColor("bg-accent");
      const _module = courseStateDatum.CompletedAssignments.includes(
        courseModule.moduleCode,
      );
      if (_module) {
        setLearnerModuleStatus("COMPLETED_COMMITMENT");
        setCredentialColor("bg-success-foreground");
      }
      if (courseModule.assignments.length === 0 || !courseModule.assignments) {
        setLearnerModuleStatus("NO_ASSIGNMENT");
        setCredentialColor("bg-gray-300");
      }
      if (courseModule.assignments.length > 0 && !isAssignmentOnchain) {
        setLearnerModuleStatus("NO_NETWORK_CREDENTIAL");
        setCredentialColor("bg-gray-300");
      }
    } else if (!!assignmentDatum) {
      if (
        learnerCourseStatus === "ENROLLED" &&
        assignmentDatum?.CommittedAssignmentId === courseModule.moduleCode
      ) {
        setLearnerModuleStatus("CURRENTLY_COMMITTED");
      } else if (
        assignmentDatum.CourseState.CompletedAssignments.includes(
          courseModule.moduleCode,
        )
      ) {
        setLearnerModuleStatus("COMPLETED_COMMITMENT");
        setCredentialColor("bg-success-foreground");
      }
    } else if (learnerCourseStatus === "WAS_ENROLLED") {
      const _module = courseTokenInfo?.AssignmentList.find(
        (a) => a === courseModule.moduleCode,
      );
      if (_module) {
        setLearnerModuleStatus("COMPLETED_COMMITMENT");
        setCredentialColor("bg-success-foreground");
      }
    }
  }, [
    courseModule,
    learnerCourseStatus,
    courseStateDatum,
    courseTokenInfo,
    isAssignmentOnchain,
    assignmentDatum,
  ]);

  return (
    <Accordion type="single" collapsible key={courseModule.moduleCode}>
      <AccordionItem
        value={`courseModule-${courseModule.moduleCode}`}
        onClick={() => setIsAccordionOpen(!isAccordionOpen)}
      >
        <AccordionTrigger
          className={`px-5 py-3 ${isAccordionOpen ? "bg-card" : "border-none hover:bg-card"}`}
        >
          <div className="grid w-11/12 grid-cols-3 items-center">
            <p className="text-left font-bold">
              Module {courseModule.moduleCode}: {courseModule.title}
            </p>
            <p className="text text-left font-bold">
              {courseModule?.assignments?.length > 0 &&
                courseModule.assignments[0]?.title}
            </p>
            <div className="flex flex-row justify-between">
              {!!assignmentCommitment ? (
                <AssignmentBadges status={assignmentCommitment.status} />
              ) : (
                <AssignmentBadges status="NOT_STARTED" />
              )}
              {learnerModuleStatus === "NEVER_COMMITTED" && (
                <Badge>Not Committed</Badge>
              )}
              {learnerModuleStatus === "CURRENTLY_COMMITTED" && (
                <Badge>Current Commitment</Badge>
              )}
              {learnerModuleStatus === "COMPLETED_COMMITMENT" && (
                <Badge>Commitment Complete</Badge>
              )}
              {learnerModuleStatus === "NO_NETWORK_CREDENTIAL" && (
                <Badge>No Network Credential</Badge>
              )}
              {learnerModuleStatus === "NO_ASSIGNMENT" && (
                <Badge>No Assignment</Badge>
              )}
            </div>
          </div>
        </AccordionTrigger>
        <AccordionContent className="py-5">
          <div className="mb-3 grid grid-cols-3 gap-3">
            <div
              className={`flex flex-col justify-between rounded-sm p-5 ${credentialColor}`}
            >
              <div>
                <h2>
                  Network Assignment Credential
                </h2>
                {learnerModuleStatus === "COMPLETED_COMMITMENT" && (
                  <p>
                    You completed this assignment and earned an Andamio Network
                    credential. Nice work!
                  </p>
                )}
                {learnerModuleStatus === "CURRENTLY_COMMITTED" && (
                  <p>
                    You are currently committed to this Assignment. A Course
                    Facilitator will approve or deny your Assignment submission.
                  </p>
                )}
                {learnerModuleStatus === "NEVER_COMMITTED" && (
                  <p>
                    You can commit to this assignment on the Andamio Network.
                    Click &quot;Go to Assignment&quot; to review the Assignment
                    and make your commitment.
                  </p>
                )}
                {learnerCourseStatus === "NEVER_ENROLLED" && (
                  <p>Enroll in this course to start earning credentials.</p>
                )}
                {learnerModuleStatus === "NO_ASSIGNMENT" && (
                  <p>
                    This Module does not have an assignment. It is provided for
                    informational purposes.
                  </p>
                )}
                {learnerModuleStatus === "NO_NETWORK_CREDENTIAL" && (
                  <p>
                    This Module does not include an on-chain credential. To
                    build your background knowledge, you can still complete the
                    Assignment.
                  </p>
                )}
              </div>
            </div>
            <div className="col-span-2 rounded-sm bg-card p-5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="text-left">
                    <h2>
                      Personal Assignment Notes
                    </h2>
                    <p>{assignmentCommitment?.learnerNotes}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="mb-5">
                      These are your personal notes, and they are only visible
                      to you.
                    </p>
                    <p>
                      To update these notes or to change the status of the
                      Assignment, click the &quot;Go to Assignment&quot; button
                      below.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="col-span-3 flex w-2/3 flex-row items-center justify-between py-5 lg:w-1/3">
              <Link
                href={`/course/${courseModule.originalCourse.courseCode}/${courseModule.moduleCode}/assignment/${courseModule.assignments[0]?.assignmentCode}`}
              >
                <Button>Go to Assignment</Button>
              </Link>
              <Link
                href={`/course/${courseModule.originalCourse.courseCode}/${courseModule.moduleCode}`}
              >
                <Button>Go to Course Module</Button>
              </Link>
              {/* TODO: */}
              {/* <Button>Update Commitment</Button> */}
              {/* <Button>Remove Commitment</Button> */}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
