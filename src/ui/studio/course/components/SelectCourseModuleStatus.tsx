import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ModuleStatus } from "@prisma/client";
import { cn } from "~/utils/shadcn";
import useCourseModule from "~/hooks/db/course/useCourseModule";
import CopyableTruncatedHash from "~/components/ui/CopyableHash";

const statusStyles = {
  [ModuleStatus.DRAFT]: "bg-gray-100 text-gray-800",
  [ModuleStatus.APPROVED]: "bg-blue-100 text-blue-800",
  [ModuleStatus.PENDING_TX]: "bg-orange-100 text-orange-800",
  [ModuleStatus.ON_CHAIN]: "bg-purple-100 text-purple-800",
  [ModuleStatus.DEPRECATED]: "bg-red-100 text-red-800",
  [ModuleStatus.BACKLOG]: "bg-gray-800 text-gray-100",
  [ModuleStatus.ARCHIVED]: "bg-gray-800 text-gray-100",
};

const validTransitions: Record<ModuleStatus, ModuleStatus[]> = {
  DRAFT: [ModuleStatus.APPROVED, ModuleStatus.BACKLOG, ModuleStatus.ARCHIVED],
  APPROVED: [ModuleStatus.DRAFT, ModuleStatus.PENDING_TX, ModuleStatus.BACKLOG, ModuleStatus.ARCHIVED],
  PENDING_TX: [ModuleStatus.ON_CHAIN],
  ON_CHAIN: [ModuleStatus.DEPRECATED],
  DEPRECATED: [],
  BACKLOG: [ModuleStatus.DRAFT, ModuleStatus.ARCHIVED],
  ARCHIVED: [ModuleStatus.BACKLOG, ModuleStatus.DRAFT],
};

const statusLabels = {
  [ModuleStatus.DRAFT]: "Draft",
  [ModuleStatus.APPROVED]: "Approved",
  [ModuleStatus.PENDING_TX]: "Pending Transaction",
  [ModuleStatus.ON_CHAIN]: "On Chain",
  [ModuleStatus.DEPRECATED]: "Deprecated",
  [ModuleStatus.BACKLOG]: "Backlog",
  [ModuleStatus.ARCHIVED]: "Archived"
};

export default function SelectCourseModuleStatus({
  moduleId,
  currentStatus,
  moduleHash,
  disabled = false,
}: {
  moduleId: string;
  currentStatus: ModuleStatus;
  moduleHash?: string;
  disabled?: boolean;
}) {
  const { updateModuleStatus, isUpdating } = useCourseModule(moduleId);

  const availableTransitions = validTransitions[currentStatus];

  const handleStatusChange = (newStatus: string) => {
    if (currentStatus === ModuleStatus.PENDING_TX &&
      newStatus === ModuleStatus.ON_CHAIN &&
      moduleHash) {
      updateModuleStatus({
        id: moduleId,
        status: newStatus as ModuleStatus,
        moduleHash
      });
    } else {
      updateModuleStatus({
        id: moduleId,
        status: newStatus as ModuleStatus
      });
    }
  };

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isUpdating || disabled}
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
      {!!moduleHash && <p>Module Hash: {CopyableTruncatedHash({ hash: moduleHash })}</p>}
    </Select>
  );
}
