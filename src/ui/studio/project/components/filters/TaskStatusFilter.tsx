import React from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { TaskStatus, type TaskCommitmentStatus } from "@prisma/client";
import { cn } from "~/utils/shadcn";

// Regular task statuses remain the same
const taskStatusLabels: Record<TaskStatus, string> = {
  DRAFT: "Draft",
  APPROVED: "Approved",
  PENDING_TX: "Pending TX",
  ON_CHAIN: "On Chain",
  BACKLOG: "Backlog",
  ARCHIVED: "Archived",
};

// Filter out and consolidate PENDING_TX statuses
export const consolidatedCommitmentStatuses = {
  PENDING_TX: "Pending TX",
  COMMITMENT_MADE: "Committed",
  COMMITMENT_DENIED: "Denied",
  COMMITMENT_ACCEPTED: "Accepted",
  COMMITMENT_REFUSED: "Refused",
  REWARDS_CLAIMED: "Rewards Claimed",
  UNLOCKED_BY_CONTRIBUTOR: "Unlocked",
  ARCHIVED: "Archived",
} as const;

export type ConsolidatedCommitmentStatus = keyof typeof consolidatedCommitmentStatuses;

const taskStatusStyles: Record<TaskStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  APPROVED: "bg-blue-100 text-blue-800",
  PENDING_TX: "bg-yellow-100 text-yellow-800",
  ON_CHAIN: "bg-purple-100 text-purple-800",
  BACKLOG: "bg-gray-800 text-gray-100",
  ARCHIVED: "bg-gray-800 text-gray-100",
};

const commitmentStatusStyles: Record<ConsolidatedCommitmentStatus, string> = {
  PENDING_TX: "bg-yellow-100 text-yellow-800",
  COMMITMENT_MADE: "bg-orange-100 text-orange-800",
  COMMITMENT_DENIED: "bg-red-100 text-red-800",
  COMMITMENT_ACCEPTED: "bg-green-100 text-green-800",
  COMMITMENT_REFUSED: "bg-red-100 text-red-800",
  REWARDS_CLAIMED: "bg-success text-success-foreground",
  UNLOCKED_BY_CONTRIBUTOR: "bg-purple-100 text-purple-800",
  ARCHIVED: "bg-gray-800 text-gray-100",
};

export type StatusFilter =
  | { type: 'task', status: TaskStatus }
  | { type: 'commitment', status: ConsolidatedCommitmentStatus };

// Helper function to consolidate status
export const consolidateStatus = (status: TaskCommitmentStatus): ConsolidatedCommitmentStatus => {
  if (status.startsWith('PENDING_TX_')) {
    return 'PENDING_TX';
  }
  return status as ConsolidatedCommitmentStatus;
};

export function TaskStatusFilter({
  selectedStatuses,
  onChange,
}: {
  selectedStatuses: StatusFilter[];
  onChange: (statuses: StatusFilter[]) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const toggleStatus = (statusFilter: StatusFilter) => {
    const isSelected = selectedStatuses.some(
      s => s.type === statusFilter.type && s.status === statusFilter.status
    );

    if (isSelected) {
      onChange(selectedStatuses.filter(
        s => !(s.type === statusFilter.type && s.status === statusFilter.status)
      ));
    } else {
      onChange([...selectedStatuses, statusFilter]);
    }
  };

  const isStatusSelected = (statusFilter: StatusFilter) =>
    selectedStatuses.some(
      s => s.type === statusFilter.type && s.status === statusFilter.status
    );

  const totalPossibleStatuses =
    Object.keys(TaskStatus).length +
    Object.keys(consolidatedCommitmentStatuses).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          intent="outline"
          size="sm"
          className={cn(
            "h-8",
            selectedStatuses.length < totalPossibleStatuses && "border-dashed",
          )}
        >
          <span>Filter by Status</span>
          <Badge variant="secondary" className="ml-2 rounded-sm">
            {selectedStatuses.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit bg-primary p-1 pb-2">
        <div className="space-y-2">
          <div className="w-64 space-y-1">
            <p className="px-2 text-sm font-medium text-foreground">Task Status</p>
            {Object.entries(taskStatusLabels).map(([status, label]) => (
              <div key={status} className="flex items-center space-x-1">
                <label htmlFor={status} className="flex-grow cursor-pointer">
                  <Badge
                    className={cn(
                      "w-full items-center justify-between font-normal",
                      taskStatusStyles[status as TaskStatus],
                    )}
                  >
                    <>
                      {label}
                      <Checkbox
                        id={status}
                        checked={isStatusSelected({ type: 'task', status: status as TaskStatus })}
                        onCheckedChange={() => toggleStatus({ type: 'task', status: status as TaskStatus })}
                      />
                    </>
                  </Badge>
                </label>
              </div>
            ))}
          </div>

          <Separator className="my-2" />

          <div className="w-64 space-y-1">
            <p className="px-2 text-sm font-medium text-foreground">Commitment Status</p>
            {Object.entries(consolidatedCommitmentStatuses).map(([status, label]) => (
              <div key={status} className="flex items-center space-x-1">
                <label htmlFor={status} className="flex-grow cursor-pointer">
                  <Badge
                    className={cn(
                      "w-full items-center justify-between font-normal",
                      commitmentStatusStyles[status as ConsolidatedCommitmentStatus],
                    )}
                  >
                    <>
                      {label}
                      <Checkbox
                        id={status}
                        checked={isStatusSelected({
                          type: 'commitment',
                          status: status as ConsolidatedCommitmentStatus
                        })}
                        onCheckedChange={() => toggleStatus({
                          type: 'commitment',
                          status: status as ConsolidatedCommitmentStatus
                        })}
                      />
                    </>
                  </Badge>
                </label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
