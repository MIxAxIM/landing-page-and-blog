import { useState, useCallback } from "react";
import Link from "next/link";
import { formatPosixTime } from "~/utils/time";
import { TaskStatus } from "@prisma/client";
import { type TaskSortKey, type SortConfig } from "~/types/sorting";
import { ConsolidatedCommitmentStatus, TaskStatusFilter, consolidateStatus, consolidatedCommitmentStatuses } from "../filters/TaskStatusFilter";
import TaskSearch from "../searches/TaskSearch";
import { ProjectDatum, Task, type Escrow } from "~/types/db";
import { getNestedValue } from "~/hooks/app/useSort";
import { Button } from "~/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { Card } from "~/components/ui/card";
import TaskStatusIndicator from "../status/TaskStatusIndicator";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { CheckCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { ChatContainer } from "~/components/chat/chat-container";

export default function ProjectTaskContributionList({
  escrow,
  treasuryId,
  showFilters = true,
  className = "",
  networkTasks,
}: {
  escrow: Escrow;
  treasuryId: string;
  showFilters?: boolean;
  className?: string;
  networkTasks?: ProjectDatum[]
}) {
  type StatusFilter =
    | { type: 'task', status: TaskStatus }
    | { type: 'commitment', status: ConsolidatedCommitmentStatus };

  // Initialize with all task statuses and all commitment statuses
  const [selectedStatuses, setSelectedStatuses] = useState<StatusFilter[]>([
    ...Object.values(TaskStatus).map(status => ({
      type: 'task' as const,
      status: status
    })),
    ...Object.values(consolidatedCommitmentStatuses).map(status => ({
      type: 'commitment' as const,
      status: status as ConsolidatedCommitmentStatus
    }))
  ]);

  // Sort state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "index",
    direction: "asc",
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort tasks
  const filteredTasks = escrow.tasks?.filter((task) => {
    // Check if task status is selected
    const isTaskStatusSelected = selectedStatuses.some(
      s => s.type === 'task' && s.status === task.status
    );

    // Check if any commitment status is selected
    const isCommitmentStatusSelected = task.taskCommitments?.some(commitment =>
      selectedStatuses.some(
        s => s.type === 'commitment' &&
          s.status === consolidateStatus(commitment.status)
      )
    );

    return isTaskStatusSelected || isCommitmentStatusSelected;
  })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Handle numeric values
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        return sortConfig.direction === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      // Handle string values
      const compareResult = String(aValue).localeCompare(String(bValue));
      return sortConfig.direction === "asc" ? compareResult : -compareResult;
    });

  // Sort handler
  const requestSort = useCallback((key: TaskSortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const validateNetworkTask = (task: Task) => {
    return networkTasks?.find((networkTask) => networkTask.project_hash === task.taskHash);
  }

  return (
    <div className={`flex flex-col mb-8 w-full ${className}`}>
      {showFilters && (
        <div className="mb-4 flex w-full flex-row items-center justify-between">
          <div className="space-x-2">
            <TaskStatusFilter
              selectedStatuses={selectedStatuses}
              onChange={setSelectedStatuses}
            />
          </div>
          <TaskSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      )}

      <div className="flex flex-col w-full overflow-x-auto">
        {filteredTasks?.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-center gap-y-3 py-8">
            <p className="">
              No tasks found. Get started by drafting one:
            </p>
          </div>
        ) : (
          filteredTasks?.map((task) => (
            <Card key={task.id} className="my-3">
              <Accordion type="single" collapsible>
                <AccordionItem value={task.id} key={task.id}>
                  <AccordionTrigger>
                    <div className="grid grid-cols-9 w-full items-center justify-between text-left">
                      <div className="col-span-3 flex flex-row gap-x-4 items-center">
                        <div className={`rounded-full bg-primary h-4 w-4`} />
                        <div className="text-lg">
                          {task.title}
                        </div>
                      </div>
                      <div className="flex w-full">
                        <p>
                          {parseInt(task.lovelace) / 1000000}{" "}
                          <span className="text-xs text-gray-500">
                            ada
                          </span>
                        </p>
                      </div>
                      <div className="flex w-full col-span-2">
                        <p>
                          <span className="text-xs text-gray-500">
                            exp.
                          </span>{" "}
                          {formatPosixTime(task.expirationTime)}
                        </p>
                      </div>
                      <div className="col-span-1">
                        <TaskStatusIndicator
                          status={task.status}
                          numAllowedCommitments={task.numAllowedCommitments}
                          taskCommitments={task.taskCommitments}
                          showLabel
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid md:grid-cols-2 gap-4 mt-6 mb-3 pt-3">
                      <div className="flex flex-col gap-y-8">
                        <h3>About</h3>
                        <div>
                          <p className="font-semibold prose">Description</p>
                          <p className="prose">{task.description}</p>
                        </div>
                        <div>
                          <p className="font-semibold prose">Acceptance Criteria</p>
                          <ul className="ml-5 list-disc">
                            {task.acceptanceCriteria.map((ac, i) => (
                              <li key={i}>{ac}</li>
                            ))}
                          </ul>
                        </div>
                        <h3>Network Status</h3>
                        {!!validateNetworkTask(task) ? (
                          <>
                            <Popover>
                              <PopoverTrigger asChild>
                                <CheckCircledIcon className="h-12 w-12 text-success" />
                              </PopoverTrigger>
                              <PopoverContent>
                                This task is validated on the Andamio Network, and you can commit to it.
                              </PopoverContent>
                            </Popover>
                            <p className="prose"># Commitments Allowed: {validateNetworkTask(task)?.commitment_allowed}</p>
                            <p className="prose text-xs">Project Hash on Andamio Network: {validateNetworkTask(task)?.project_hash}</p>
                          </>
                        ) : (
                          <>
                            <Popover>
                              <PopoverTrigger asChild>
                                <ExclamationTriangleIcon className="h-12 w-12 text-secondary" />
                              </PopoverTrigger>
                              <PopoverContent>
                                This task is not yet validated on the Andamio Network.
                              </PopoverContent>
                            </Popover>
                          </>
                        )}
                        <div>
                          {(task.status === "APPROVED" || task.status === "ON_CHAIN") && (
                            <Link href={`/app/contribute/task/${task.id}`}>
                              <Button size="dialog">View Public Task</Button>
                            </Link>
                          )}
                        </div>

                      </div>
                      <div className="col-span-1">
                        <h3>Chat</h3>
                        <ChatContainer roomId={task.id} />
                      </div>

                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
