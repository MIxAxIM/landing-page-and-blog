import React from "react";
import {
  DotFilledIcon,
  CheckCircledIcon,
  TimerIcon,
  LightningBoltIcon,
  CrossCircledIcon,
  BackpackIcon,
  ArchiveIcon,
} from "@radix-ui/react-icons";
import { cn } from "~/utils/shadcn";
import { ModuleStatus } from "@prisma/client";

const statusConfig = {
  [ModuleStatus.DRAFT]: {
    icon: DotFilledIcon,
    color: "text-gray-800",
    background: "bg-gray-100",
  },
  [ModuleStatus.APPROVED]: {
    icon: CheckCircledIcon,
    color: "text-blue-800",
    background: "bg-blue-100",
  },
  [ModuleStatus.PENDING_TX]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [ModuleStatus.ON_CHAIN]: {
    icon: LightningBoltIcon,
    color: "text-purple-800",
    background: "bg-purple-100",
  },
  [ModuleStatus.DEPRECATED]: {
    icon: CrossCircledIcon,
    color: "text-red-800",
    background: "bg-red-100",
  },
  [ModuleStatus.BACKLOG]: {
    icon: BackpackIcon,
    color: "text-gray-100",
    background: "bg-gray-800",
  },
  [ModuleStatus.ARCHIVED]: {
    icon: ArchiveIcon,
    color: "text-gray-100",
    background: "bg-gray-800",
  },
};

export default function ModuleStatusIndicator({
  status,
  className,
  showLabel = false,
}: {
  status: ModuleStatus;
  className?: string;
  showLabel?: boolean;
}) {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <div className="flex items-center gap-2 my-auto">
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
