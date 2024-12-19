// AssignmentStatusIndicators.tsx
import React from "react";
import {
  DotFilledIcon,
  DrawingPinIcon,
  CheckCircledIcon,
  CrossCircledIcon,
  TimerIcon,
  BookmarkIcon,
  PlayIcon,
  CheckIcon,
  GlobeIcon,
  ArchiveIcon,
} from "@radix-ui/react-icons";
import { cn } from "~/utils/shadcn";
import { AssignmentPrivateStatus, AssignmentNetworkStatus } from "@prisma/client";
import { Badge } from "~/components/ui/badge";

// Configuration for private status icons and styling
const privateStatusConfig = {
  [AssignmentPrivateStatus.SAVE_FOR_LATER]: {
    icon: BookmarkIcon,
    color: "text-blue-800",
    background: "bg-blue-100",
  },
  [AssignmentPrivateStatus.IN_PROGRESS]: {
    icon: PlayIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [AssignmentPrivateStatus.COMPLETE]: {
    icon: CheckIcon,
    color: "text-green-800",
    background: "bg-green-100",
  },
  [AssignmentPrivateStatus.COMMITMENT]: {
    icon: GlobeIcon,
    color: "text-purple-800",
    background: "bg-purple-100",
  },
  [AssignmentPrivateStatus.NETWORK_READY]: {
    icon: DrawingPinIcon,
    color: "text-orange-800",
    background: "bg-orange-100",
  },
  [AssignmentPrivateStatus.NOT_STARTED]: {
    icon: DotFilledIcon,
    color: "text-gray-800",
    background: "bg-gray-100",
  },
};

// Configuration for network status icons and styling
const networkStatusConfig = {
  [AssignmentNetworkStatus.PENDING_TX_COMMITMENT_MADE]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [AssignmentNetworkStatus.PENDING_TX_ADD_INFO]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [AssignmentNetworkStatus.PENDING_APPROVAL]: {
    icon: TimerIcon,
    color: "text-blue-800",
    background: "bg-blue-100",
  },
  [AssignmentNetworkStatus.PENDING_TX_ASSIGNMENT_ACCEPTED]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [AssignmentNetworkStatus.ASSIGNMENT_ACCEPTED]: {
    icon: CheckCircledIcon,
    color: "text-green-800",
    background: "bg-green-100",
  },
  [AssignmentNetworkStatus.PENDING_TX_ASSIGNMENT_DENIED]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [AssignmentNetworkStatus.ASSIGNMENT_DENIED]: {
    icon: CrossCircledIcon,
    color: "text-red-800",
    background: "bg-red-100",
  },
  [AssignmentNetworkStatus.PENDING_TX_LEAVE_ASSIGNMENT]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [AssignmentNetworkStatus.ASSIGNMENT_LEFT]: {
    icon: CheckCircledIcon,
    color: "text-green-800",
    background: "bg-green-100",
  },
  [AssignmentNetworkStatus.PENDING_TX_CLAIM_CREDENTIAL]: {
    icon: TimerIcon,
    color: "text-yellow-800",
    background: "bg-yellow-100",
  },
  [AssignmentNetworkStatus.CREDENTIAL_CLAIMED]: {
    icon: CheckCircledIcon,
    color: "text-green-800",
    background: "bg-green-100",
  },
};

const StatusIcon = ({
  config,
  className
}: {
  config: typeof privateStatusConfig[keyof typeof privateStatusConfig] | typeof networkStatusConfig[keyof typeof networkStatusConfig],
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

interface AssignmentCommitmentStatusIndicatorProps {
  privateStatus?: AssignmentPrivateStatus;
  networkStatus?: AssignmentNetworkStatus;
  className?: string;
  showLabel?: boolean;
}

export function AssignmentCommitmentStatusIndicator({
  privateStatus,
  networkStatus,
  className,
  showLabel = false,
}: AssignmentCommitmentStatusIndicatorProps) {
  const config = networkStatus ? networkStatusConfig[networkStatus] : privateStatusConfig[privateStatus ?? "NOT_STARTED"];
  const status = networkStatus || privateStatus;

  return (
    <div className="flex items-center gap-2">
      <StatusIcon config={config} className={className} />
      {showLabel && status && (
        <span className={cn("text-xs font-medium", config.color)}>
          {status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' ')}
        </span>
      )}
    </div>
  );
}

interface AssignmentCommitmentsSummaryIndicatorProps {
  assignmentCommitments: {
    privateStatus: AssignmentPrivateStatus;
    networkStatus?: AssignmentNetworkStatus;
  }[];
  className?: string;
}

export function AssignmentCommitmentsSummaryIndicator({
  assignmentCommitments,
  className,
}: AssignmentCommitmentsSummaryIndicatorProps) {
  // Count commitments by network status if present, otherwise by private status
  const statusCounts = assignmentCommitments.reduce((acc, commitment) => {
    const status = commitment.networkStatus || commitment.privateStatus;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {Object.entries(statusCounts).map(([status, count]) => {
        const isNetworkStatus = Object.keys(networkStatusConfig).includes(status);
        const config = isNetworkStatus
          ? networkStatusConfig[status as AssignmentNetworkStatus]
          : privateStatusConfig[status as AssignmentPrivateStatus];

        return (
          <Badge
            key={status}
            variant="secondary"
            className={cn(
              "text-xs",
              config.color,
              config.background
            )}
          >
            {count}x {status.toLowerCase().replace(/_/g, ' ')}
          </Badge>
        );
      })}
    </div>
  );
}
