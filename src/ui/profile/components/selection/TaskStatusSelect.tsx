import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useTask } from "~/hooks/contribution/useTask";
import { TaskStatus } from "@prisma/client";
import { cn } from "~/utils/shadcn";

// Map status to background colors
const statusStyles = {
  [TaskStatus.DRAFT]: "bg-gray-100 text-gray-800",
  [TaskStatus.APPROVED]: "bg-blue-100 text-blue-800",
  [TaskStatus.ON_CHAIN]: "bg-purple-100 text-purple-800",
  [TaskStatus.COMMITMENT_MADE]: "bg-orange-100 text-orange-800",
  [TaskStatus.COMPLETE]: "bg-green-100 text-green-800",
};

const validTransitions: Record<TaskStatus, TaskStatus[]> = {
  DRAFT: [TaskStatus.APPROVED],
  APPROVED: [TaskStatus.ON_CHAIN, TaskStatus.DRAFT],
  ON_CHAIN: [TaskStatus.COMMITMENT_MADE, TaskStatus.APPROVED],
  COMMITMENT_MADE: [TaskStatus.COMPLETE, TaskStatus.ON_CHAIN],
  COMPLETE: [TaskStatus.COMMITMENT_MADE],
};

const statusLabels = {
  [TaskStatus.DRAFT]: "Draft",
  [TaskStatus.APPROVED]: "Approved",
  [TaskStatus.ON_CHAIN]: "On Chain",
  [TaskStatus.COMMITMENT_MADE]: "Committed",
  [TaskStatus.COMPLETE]: "Complete",
};

export default function TaskStatusSelect({
  taskId,
  currentStatus,
}: {
  taskId: string;
  currentStatus: TaskStatus;
}) {
  const { updateTaskStatus, isUpdating } = useTask({ id: taskId });

  const availableTransitions = validTransitions[currentStatus];

  const handleStatusChange = (newStatus: string) => {
    updateTaskStatus({
      id: taskId,
      status: newStatus as TaskStatus,
    });
  };

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isUpdating}
    >
      <SelectTrigger
        className={cn("py-1 text-xs font-medium", statusStyles[currentStatus])}
      >
        <SelectValue placeholder="Select status">
          {statusLabels[currentStatus]}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          value={currentStatus}
          className={cn(
            "rounded-none text-xs font-medium",
            statusStyles[currentStatus],
          )}
        >
          {statusLabels[currentStatus]}
        </SelectItem>
        {availableTransitions.map((status) => (
          <SelectItem
            key={status}
            value={status}
            className={cn(
              "rounded-none text-xs font-medium",
              statusStyles[status],
            )}
          >
            {statusLabels[status]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
