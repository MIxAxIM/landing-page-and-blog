import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useTask } from "~/hooks/db/contribution/useTask";
import { TaskStatus } from "@prisma/client";
import { cn } from "~/utils/shadcn";

// Map status to background colors
const statusStyles = {
  [TaskStatus.DRAFT]: "bg-gray-100 text-gray-800",
  [TaskStatus.APPROVED]: "bg-blue-100 text-blue-800",
  [TaskStatus.PENDING_TX]: "bg-yellow-100 text-yellow-800",
  [TaskStatus.ON_CHAIN]: "bg-purple-100 text-purple-800",
  [TaskStatus.BACKLOG]: "bg-gray-800 text-gray-100",
  [TaskStatus.ARCHIVED]: "bg-gray-800 text-gray-100",
};

const validTransitions: Record<TaskStatus, TaskStatus[]> = {
  DRAFT: [TaskStatus.APPROVED, TaskStatus.ARCHIVED, TaskStatus.BACKLOG],
  APPROVED: [TaskStatus.DRAFT],
  PENDING_TX: [],
  ON_CHAIN: [],
  BACKLOG: [TaskStatus.DRAFT, TaskStatus.ARCHIVED, TaskStatus.APPROVED],
  ARCHIVED: [TaskStatus.DRAFT, TaskStatus.BACKLOG],
};

const statusLabels = {
  [TaskStatus.DRAFT]: "Draft",
  [TaskStatus.APPROVED]: "Approved",
  [TaskStatus.PENDING_TX]: "Pending TX",
  [TaskStatus.ON_CHAIN]: "On Chain",
  [TaskStatus.BACKLOG]: "Backlog",
  [TaskStatus.ARCHIVED]: "Archived",
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
