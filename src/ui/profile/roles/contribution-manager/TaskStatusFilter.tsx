import React from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { TaskStatus } from "@prisma/client";
import { cn } from "~/utils/shadcn";

const statusLabels: Record<TaskStatus, string> = {
  DRAFT: "Draft",
  APPROVED: "Approved",
  ON_CHAIN: "On Chain",
  COMMITMENT_MADE: "Committed",
  COMPLETE: "Complete",
};

const statusStyles: Record<TaskStatus, string> = {
  DRAFT: "bg-gray-100 text-gray-800",
  APPROVED: "bg-blue-100 text-blue-800",
  ON_CHAIN: "bg-purple-100 text-purple-800",
  COMMITMENT_MADE: "bg-orange-100 text-orange-800",
  COMPLETE: "bg-green-100 text-green-800",
};

export default function TaskStatusFilter({
  selectedStatuses,
  onChange,
}: {
  selectedStatuses: TaskStatus[];
  onChange: (statuses: TaskStatus[]) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const toggleStatus = (status: TaskStatus) => {
    if (selectedStatuses.includes(status)) {
      onChange(selectedStatuses.filter((s) => s !== status));
    } else {
      onChange([...selectedStatuses, status]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          intent="outline"
          size="sm"
          className={cn(
            "h-8",
            selectedStatuses.length < Object.keys(TaskStatus).length &&
              "border-dashed",
          )}
        >
          <span>Filter by Status</span>
          <Badge variant="secondary" className="ml-2 rounded-sm">
            {selectedStatuses.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit bg-primary p-1 pb-2">
        <div className="w-40 space-y-1">
          {Object.values(TaskStatus).map((status) => (
            <div key={status} className="flex items-center space-x-1">
              <label htmlFor={status} className="flex-grow cursor-pointer">
                <Badge
                  className={cn(
                    "w-full items-center justify-between font-normal",
                    statusStyles[status],
                  )}
                >
                  <>
                    {statusLabels[status]}
                    <Checkbox
                      id={status}
                      checked={selectedStatuses.includes(status)}
                      onCheckedChange={() => toggleStatus(status)}
                    />
                  </>
                </Badge>
              </label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
