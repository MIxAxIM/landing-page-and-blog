import React from "react";
import {
  DotFilledIcon,
  DrawingPinIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  UpdateIcon,
  LightningBoltIcon,
  TimerIcon,
  ArchiveIcon,
  BackpackIcon
} from "@radix-ui/react-icons";
import { cn } from "~/utils/shadcn";
import { TaskStatus } from "@prisma/client";

const statusConfig = {
  [TaskStatus.DRAFT]: {
    icon: DotFilledIcon,
    color: "text-gray-800",
    background: "bg-gray-100",
  },
  [TaskStatus.APPROVED]: {
    icon: CheckCircledIcon,
    color: "text-blue-800",
    background: "bg-blue-100",
  },
  [TaskStatus.PENDING_TX]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [TaskStatus.ON_CHAIN]: {
    icon: LightningBoltIcon,
    color: "text-purple-800",
    background: "bg-purple-100",
  },
  [TaskStatus.BACKLOG]: {
    icon: BackpackIcon,
    color: "text-gray-100",
    background: "bg-gray-800",
  },
  [TaskStatus.ARCHIVED]: {
    icon: ArchiveIcon,
    color: "text-gray-100",
    background: "bg-gray-800",
  },
};

export default function TaskStatusIndicator({
  status,
  className,
  showLabel = false,
}: {
  status: TaskStatus;
  className?: string;
  showLabel?: boolean;
}) {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center rounded-full p-1",
          config.background,
          className
        )}
      >
        <IconComponent className={cn("h-4 w-4", config.color)} />
      </div>
      {showLabel && (
        <span className={cn("text-xs font-medium", config.color)}>
          {status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' ')}
        </span>
      )}
    </div>
  );
}
