import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import Link from "next/link";
import AssignmentBadges from "~/components/ui/assignment-badges";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { ArchiveIcon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import {
  useLearnerAssignmentStatuses,
  type LearnerAssignment,
} from "~/hooks/course/useLearnerAssignmentStatuses";

export default function AssignmentsSection({
  learnerAssignments,
}: {
  learnerAssignments: LearnerAssignment[];
}) {
  const { updateSession } = useLearnerAssignmentStatuses();
  const ctx = api.useUtils();

  const [showArchived, setShowArchived] = useState(false);

  const { mutate: updateArchivedStatus } =
    api.assignmentStatus.setArchived.useMutation({
      onSuccess: () => {
        toast.success("Assignment archived");
        void ctx.assignmentStatus.getLearnerCommitments.invalidate();
        void ctx.assignmentStatus.getAssignmentCommitments.invalidate();
        void updateSession();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors;
        if (errorMessage) {
          toast.error(JSON.stringify(errorMessage));
        } else {
          toast.error("Error updating the Assignment");
        }
      },
    });

  function handleArchive(assignment: string, archived: boolean) {
    updateArchivedStatus({
      assignmentCommitmentId: assignment,
      archived: archived,
    });
  }

  return (
    <div className="mx-auto flex w-11/12 flex-col gap-3 lg:w-5/6">
      <div className="flex flex-row items-center justify-between">
        <h2 className="my-10 text-4xl">My Assignment Notes</h2>
        <Button className="my-5" onClick={() => setShowArchived(!showArchived)}>
          {showArchived
            ? "Hide Archived Assignments"
            : "Show Archived Assignments"}
        </Button>
      </div>
      {learnerAssignments.map((la, i) => {
        if (la.archived && !showArchived) return null;

        return (
          <Card
            className="mx-auto flex w-full flex-col border border-primary"
            key={i}
          >
            <CardHeader>
              <div className="grid w-full grid-cols-8 items-center justify-between">
                <p className="text col-span-4 font-bold">{la.title}</p>
                <p className="text-sm font-semibold">{la.courseTitle}</p>
                <p className="col-span-2 text-sm font-semibold">
                  Module {la.moduleCode}: {la.moduleTitle}
                </p>
                <AssignmentBadges status={la.status} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-10">
                <div>
                  <Link
                    href={`/course/${la.courseCode}/${la.moduleCode}/assignment/${la.assignmentCode}`}
                  >
                    <Button size="sm" className="mt-5">
                      View Assignment
                    </Button>
                  </Link>
                </div>
                <div className="col-span-2 rounded-md bg-white p-5">
                  <h2 className="pb-2 text-lg font-bold">
                    What I want to remember about this Assignment:
                  </h2>
                  <p>{la.learnerNote}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {!la.archived && (
                <div role="button" onClick={() => handleArchive(la.id, true)}>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <ArchiveIcon
                          width={30}
                          height={30}
                          className="hover:text-amber-800"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        Archive this Assignment. You will still be able to view
                        it later.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
              {!!la.archived && (
                <Button
                  role="button"
                  onClick={() => handleArchive(la.id, false)}
                >
                  Un-Archive this Assignment
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
