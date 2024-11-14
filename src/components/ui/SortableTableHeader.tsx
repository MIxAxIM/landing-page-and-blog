import { TableHead } from "~/components/ui/table";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { type TaskSortKey, type SortConfig } from "~/types/sorting";
import { cn } from "~/utils/shadcn";

interface SortableTableHeaderProps {
  label: string;
  sortKey: TaskSortKey;
  sortConfig: SortConfig;
  onSort: (key: TaskSortKey) => void;
  className?: string;
}

export function SortableTableHeader({
  label,
  sortKey,
  sortConfig,
  onSort,
  className,
}: SortableTableHeaderProps) {
  const isSorted = sortConfig.key === sortKey;

  return (
    <TableHead
      className={cn("cursor-pointer select-none py-3", className)}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <span className="text-primary-foreground">
          {isSorted ? (
            sortConfig.direction === "asc" ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )
          ) : (
            <ChevronsUpDown className="h-4 w-4" />
          )}
        </span>
      </div>
    </TableHead>
  );
}
