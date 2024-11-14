import { Table, TableHead, TableCell, TableRow } from "~/components/ui/table";
import Link from "next/link";
import { useTask } from "~/hooks/contribution/useTask";
import { formatPosixTime } from "~/utils/time";
import { TaskStatus } from "@prisma/client";
import { useState, useCallback } from "react";
import { useEscrow } from "~/hooks/contribution/useEscrow";
import { SortableTableHeader } from "~/components/ui/SortableTableHeader";
import { type TaskSortKey, type SortConfig } from "~/types/sorting";
import DialogTask from "../dialogs/DialogTask";
import TaskEscrowFilter from "../filters/TaskEscrowFilter";
import TaskStatusFilter from "../filters/TaskStatusFilter";
import TaskSearch from "../searches/TaskSearch";
import TaskStatusSelect from "../selection/TaskStatusSelect";
import { Button } from "~/components/ui/button";

export default function TreasuryTaskListComponent({
  treasury,
}: {
  treasury: string;
}) {
  // Status filter state
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>(
    Object.values(TaskStatus),
  );

  // Get all escrows for this treasury
  const { escrows } = useEscrow({});
  const treasuryEscrows = escrows.filter(
    (escrow) => escrow?.treasuryId === treasury && !!escrow.title,
  );

  // Escrow filter state - initialize with all escrow IDs
  const [selectedEscrows, setSelectedEscrows] = useState<string[]>(
    treasuryEscrows.map((escrow) => escrow?.id ?? ""),
  );

  // Sort state
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "index",
    direction: "asc",
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Get filtered and sorted tasks
  const { filteredTasks, isLoading } = useTask({
    treasuryNftPolicyId: treasury,
    selectedStatuses,
    selectedEscrows,
    searchQuery,
    sortConfig,
  });

  // Sort handler
  const requestSort = useCallback((key: TaskSortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  return (
    <div className="mb-8 w-full">
      <div className="mb-4 flex w-full flex-row items-center justify-between">
        <div className="space-x-2">
          <TaskStatusFilter
            selectedStatuses={selectedStatuses}
            onChange={setSelectedStatuses}
          />
          {treasuryEscrows && (
            <TaskEscrowFilter
              escrows={treasuryEscrows.filter(
                (escrow): escrow is NonNullable<typeof escrow> =>
                  escrow !== null &&
                  escrow.treasuryId === treasury &&
                  !!escrow.title?.length &&
                  escrow.title.length > 0,
              )}
              selectedEscrows={selectedEscrows}
              onChange={setSelectedEscrows}
            />
          )}
        </div>
        <TaskSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      </div>
      <div className="w-full overflow-x-auto">
        <Table className="w-full table-fixed">
          <thead>
            <TableRow className="bg-primary hover:bg-primary">
              <SortableTableHeader
                label="#"
                sortKey="index"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="w-12 text-primary-foreground"
              />
              <SortableTableHeader
                label="Title"
                sortKey="title"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="w-32 text-primary-foreground"
              />
              <SortableTableHeader
                label="Description"
                sortKey="description"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="w-48 text-primary-foreground"
              />
              <SortableTableHeader
                label="Circle"
                sortKey="escrow.escrowNftPolicyId"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="w-32 text-primary-foreground"
              />
              <TableHead className="w-1/6 text-primary-foreground">
                Acceptance Criteria
              </TableHead>
              <SortableTableHeader
                label="Expiration Time"
                sortKey="expirationTime"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="w-32 text-primary-foreground"
              />
              <SortableTableHeader
                label="Ada"
                sortKey="lovelace"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="w-20 text-primary-foreground"
              />
              <SortableTableHeader
                label="Status"
                sortKey="status"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="w-28 text-primary-foreground"
              />
              <TableHead className="w-24 text-primary-foreground">
                Actions
              </TableHead>
            </TableRow>
          </thead>
          <tbody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => (
                <TableRow key={task.id} className="border-t border-black">
                  <TableCell className="align-top">{task.index}</TableCell>
                  <TableCell className="align-top">
                    <Link
                      href={`/contribution/${treasury}/${task.escrow?.escrowNftPolicyId}/${task.index}`}
                    >
                      {task.title}
                    </Link>
                  </TableCell>
                  <TableCell className="truncate align-top">
                    {task.description}
                  </TableCell>
                  <TableCell className="align-top">
                    {task.escrow?.title ?? "not defined"}
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
                  <TableCell className="items-center justify-center gap-x-2">
                    <DialogTask openButtonSize="sm" id={task.id} />
                    <Link href={`/contribute/task/${task.id}`}>
                      <Button size="sm">Public Task</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
