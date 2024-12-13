import React from "react";
import {
  DrawingPinIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  TimerIcon,
  ArchiveIcon,
  QuestionMarkCircledIcon,
  LinkBreak2Icon,
  StarIcon
} from "@radix-ui/react-icons";
import { cn } from "~/utils/shadcn";
import { TaskCommitmentStatus } from "@prisma/client";

const statusConfig = {
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
    icon: QuestionMarkCircledIcon,
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
    icon: LinkBreak2Icon,
    color: "text-red-800",
    background: "bg-red-100",
  },
  [TaskCommitmentStatus.PENDING_TX_GET_REWARDS]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [TaskCommitmentStatus.REWARDS_CLAIMED]: {
    icon: StarIcon,
    color: "text-purple-800",
    background: "bg-purple-100",
  },
  [TaskCommitmentStatus.PENDING_TX_UNLOCKED_BY_CONTRIBUTOR]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [TaskCommitmentStatus.UNLOCKED_BY_CONTRIBUTOR]: {
    icon: LinkBreak2Icon,
    color: "text-gray-800",
    background: "bg-gray-100",
  },
  [TaskCommitmentStatus.ARCHIVED]: {
    icon: ArchiveIcon,
    color: "text-gray-100",
    background: "bg-gray-800",
  },
};

export default function TaskCommitmentStatusIndicator({
  status,
  className,
  showLabel = false,
}: {
  status: TaskCommitmentStatus;
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
