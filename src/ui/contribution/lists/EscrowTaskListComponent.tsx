import { useState, useCallback } from "react";
import { Table, TableHead, TableCell, TableRow } from "~/components/ui/table";
import Link from "next/link";
import { formatPosixTime } from "~/utils/time";
import { TaskStatus } from "@prisma/client";
import { SortableTableHeader } from "~/components/ui/SortableTableHeader";
import { type TaskSortKey, type SortConfig } from "~/types/sorting";
import TaskStatusFilter from "../filters/TaskStatusFilter";
import TaskSearch from "../searches/TaskSearch";
import TaskStatusSelect from "../selection/TaskStatusSelect";
import { type Escrow } from "~/types/db";
import { getNestedValue } from "~/hooks/app/useSort";
import { Button } from "~/components/ui/button";
import DialogDeleteTask from "../dialogs/DialogDeleteTask";

export default function EscrowTaskListComponent({
  escrow,
  treasuryId,
  showFilters = true,
  className = "",
}: {
  escrow?: Escrow;
  treasuryId?: string;
  showFilters?: boolean;
  className?: string;
}) {
  // Status filter state
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>(
    Object.values(TaskStatus),
  );

  // Sort state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "index",
    direction: "asc",
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort tasks
  const filteredTasks = escrow?.tasks
    .filter((task) => {
      // Status filter
      if (!selectedStatuses.includes(task.status)) return false;

      // Search filter
      if (searchQuery.trim()) {
        const search = searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(search) ||
          task.description.toLowerCase().includes(search) ||
          task.acceptanceCriteria.some((criteria) =>
            criteria.toLowerCase().includes(search),
          )
        );
      }

      return true;
    })
    .sort((a, b) => {
      if (!sortConfig.key) return 0;

      const aValue = getNestedValue(a, sortConfig.key);
      const bValue = getNestedValue(b, sortConfig.key);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Handle numeric values
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        return sortConfig.direction === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      // Handle string values
      const compareResult = String(aValue).localeCompare(String(bValue));
      return sortConfig.direction === "asc" ? compareResult : -compareResult;
    });

  // Sort handler
  const requestSort = useCallback((key: TaskSortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  return (
    <div className={`mb-8 w-full ${className}`}>
      {showFilters && (
        <div className="mb-4 flex w-full flex-row items-center justify-between">
          <div className="space-x-2">
            <TaskStatusFilter
              selectedStatuses={selectedStatuses}
              onChange={setSelectedStatuses}
            />
          </div>
          <TaskSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <Table className="w-full table-fixed">
          <thead>
            <TableRow className="bg-primary hover:bg-primary">
              <SortableTableHeader
                label="#"
                sortKey="index"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="min-w-12 text-primary-foreground"
              />
              <SortableTableHeader
                label="Title"
                sortKey="title"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="min-w-40 text-primary-foreground"
              />
              <SortableTableHeader
                label="Description"
                sortKey="description"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="min-w-48 text-primary-foreground"
              />
              <TableHead className="min-w-1/6 text-primary-foreground">
                Acceptance Criteria
              </TableHead>
              <SortableTableHeader
                label="Expiration Time"
                sortKey="expirationTime"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="min-w-32 text-primary-foreground"
              />
              <SortableTableHeader
                label="Ada"
                sortKey="lovelace"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="min-w-20 text-primary-foreground"
              />
              <SortableTableHeader
                label="Status"
                sortKey="status"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="min-w-28 text-primary-foreground"
              />
              <TableHead className="min-w-24 text-primary-foreground">
                Actions
              </TableHead>
            </TableRow>
          </thead>
          <tbody>
            {filteredTasks?.length === 0 ? (
              <TableRow className="">
                <TableCell colSpan={8}>
                  <div className="flex w-full flex-col items-center justify-center gap-y-3 py-8">
                    <p className="">
                      No tasks found. Get started by drafting one:
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks?.map((task) => (
                <TableRow key={task.id} className="border-t border-black">
                  <TableCell className="align-top">{task.index}</TableCell>
                  <TableCell className="align-top">
                    {treasuryId && escrow ? (
                      <Link
                        href={`/contribution/${treasuryId}/${escrow.escrowNftPolicyId}/${task.index}`}
                      >
                        {task.title}
                      </Link>
                    ) : (
                      task.title
                    )}
                  </TableCell>
                  <TableCell className="truncate align-top">
                    {task.description}
                  </TableCell>
                  <TableCell className="align-top">
                    <ul className="ml-5 list-disc">
                      {task.acceptanceCriteria.map((ac, i) => (
                        <li key={i}>{ac}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="align-top">
                    {formatPosixTime(task.expirationTime)}
                  </TableCell>
                  <TableCell className="align-top">
                    {parseInt(task.lovelace) / 1000000}
                  </TableCell>
                  <TableCell className="">
                    <TaskStatusSelect
                      taskId={task.id}
                      currentStatus={task.status}
                    />
                  </TableCell>
                  <TableCell className="">
                    <div className="flex h-fit items-center justify-center gap-x-2">
                      <DialogDeleteTask id={task.id} />
                    </div>
                  </TableCell>
                  {!!escrow?.escrowNftPolicyId && (

                    <TableCell className="items-center justify-center gap-x-2">
                      <Link href={`/app/contribute/task/${task.id}`}>
                        <Button size="dialog">Public Task</Button>
                      </Link>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
