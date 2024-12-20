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
import { TaskStatus, TaskCommitmentStatus } from "@prisma/client";
import { Badge } from "~/components/ui/badge";

const taskStatusConfig = {
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
    color: "text-red-500",
    background: "bg-gray-800",
  },
  [TaskStatus.ARCHIVED]: {
    icon: ArchiveIcon,
    color: "text-red-500",
    background: "bg-purple-300",
  },
};

const commitmentStatusConfig = {
  [TaskCommitmentStatus.AWAITING_EVIDENCE]: {
    icon: TimerIcon,
    color: "text-indigo-800",
    background: "bg-indigo-200",
  },
  [TaskCommitmentStatus.PENDING_TX_COMMITMENT_MADE]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [TaskCommitmentStatus.COMMITMENT_MADE]: {
    icon: DrawingPinIcon,
    color: "text-orange-800",
    background: "bg-orange-100",
  },
  [TaskCommitmentStatus.PENDING_TX_ADD_INFO]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [TaskCommitmentStatus.PENDING_APPROVAL]: {
    icon: TimerIcon,
    color: "text-blue-800",
    background: "bg-blue-100",
  },
  [TaskCommitmentStatus.PENDING_TX_COMMITMENT_DENIED]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [TaskCommitmentStatus.COMMITMENT_DENIED]: {
    icon: CrossCircledIcon,
    color: "text-red-800",
    background: "bg-red-100",
  },
  [TaskCommitmentStatus.PENDING_TX_COMMITMENT_ACCEPTED]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [TaskCommitmentStatus.COMMITMENT_ACCEPTED]: {
    icon: CheckCircledIcon,
    color: "text-green-800",
    background: "bg-green-100",
  },
  [TaskCommitmentStatus.PENDING_TX_COMMITMENT_REFUSED]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [TaskCommitmentStatus.COMMITMENT_REFUSED]: {
    icon: CrossCircledIcon,
    color: "text-red-800",
    background: "bg-red-100",
  },
  [TaskCommitmentStatus.PENDING_TX_GET_REWARDS]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [TaskCommitmentStatus.REWARDS_CLAIMED]: {
    icon: CheckCircledIcon,
    color: "text-green-800",
    background: "bg-green-100",
  },
  [TaskCommitmentStatus.PENDING_TX_UNLOCKED_BY_CONTRIBUTOR]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [TaskCommitmentStatus.UNLOCKED_BY_CONTRIBUTOR]: {
    icon: UpdateIcon,
    color: "text-purple-800",
    background: "bg-purple-100",
  },
  [TaskCommitmentStatus.ARCHIVED]: {
    icon: ArchiveIcon,
    color: "text-gray-100",
    background: "bg-gray-800",
  },
};

const StatusIcon = ({
  config,
  className
}: {
  config: typeof taskStatusConfig[keyof typeof taskStatusConfig],
  className?: string
}) => {
  const IconComponent = config.icon;
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full p-1",
        config.background,
        className
      )}
    >
      <IconComponent className={cn("h-4 w-4", config.color)} />
    </div>
  );
};

interface TaskStatusIndicatorProps {
  status: TaskStatus;
  taskCommitments?: {
    id?: string;
    status: TaskCommitmentStatus;
    contributorId: string;
  }[];
  numAllowedCommitments: number;
  className?: string;
  showLabel?: boolean;
}

export default function TaskStatusIndicator({
  status,
  taskCommitments,
  numAllowedCommitments,
  className,
  showLabel = false,
}: TaskStatusIndicatorProps) {
  // If task has no commitments or is in a terminal state, show task status
  if (status === TaskStatus.DRAFT || status === TaskStatus.APPROVED || status === TaskStatus.PENDING_TX || status === TaskStatus.BACKLOG) {
    const config = taskStatusConfig[status];
    return (
      <div className="flex items-center gap-2">
        <StatusIcon config={config} className={className} />
        {showLabel && (
          <span className={cn("text-xs font-medium", config.color)}>
            {status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' ')}
          </span>
        )}
      </div>
    );
  }

  // If task has single commitment allowed, show the commitment status
  if (numAllowedCommitments === 1 && taskCommitments?.length === 1) {
    const commitment = taskCommitments[0]!;
    const commitmentStatus = commitment.status as TaskCommitmentStatus;
    const config = commitmentStatusConfig[commitmentStatus];
    return (
      <div className="flex items-center gap-2">
        <StatusIcon config={config} className={className} />
        {showLabel && (
          <span className={cn("text-xs font-medium", config.color)}>
            {commitment.status.charAt(0) +
              commitment.status.slice(1).toLowerCase().replace(/_/g, ' ')}
          </span>
        )}
      </div>
    );
  }

  // If task has multiple commitments allowed, show count by status
  const statusCounts = taskCommitments?.reduce((acc, commitment) => {
    const status = commitment.status as TaskCommitmentStatus;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<TaskCommitmentStatus, number>);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusIcon config={taskStatusConfig[status]} className={className} />
      {showLabel && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusCounts ?? 0).map(([commitStatus, count]) => (
            <Badge
              key={commitStatus}
              variant="secondary"
              className={cn(
                "text-xs",
                commitmentStatusConfig[commitStatus as TaskCommitmentStatus].color,
                commitmentStatusConfig[commitStatus as TaskCommitmentStatus].background
              )}
            >
              {count}x {commitStatus.toLowerCase().replace(/_/g, ' ')}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
