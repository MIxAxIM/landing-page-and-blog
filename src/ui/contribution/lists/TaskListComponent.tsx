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

export default function TaskListComponent({ treasury }: { treasury: string }) {
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
    <div className="w-full">
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
            <TableRow>
              <SortableTableHeader
                label="#"
                sortKey="index"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="w-12"
              />
              <SortableTableHeader
                label="Title"
                sortKey="title"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="w-40"
              />
              <SortableTableHeader
                label="Description"
                sortKey="description"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="w-48"
              />
              <SortableTableHeader
                label="Escrow"
                sortKey="escrow.escrowNftPolicyId"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="w-20"
              />
              <TableHead className="w-1/6">Acceptance Criteria</TableHead>
              <SortableTableHeader
                label="Expiration Time"
                sortKey="expirationTime"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="w-32"
              />
              <SortableTableHeader
                label="Ada"
                sortKey="lovelace"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="w-20"
              />
              <SortableTableHeader
                label="Status"
                sortKey="status"
                sortConfig={sortConfig}
                onSort={requestSort}
                className="w-28"
              />
              <TableHead className="w-24">Actions</TableHead>
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
                <TableRow key={task.id}>
                  <TableCell>{task.index}</TableCell>
                  <TableCell>
                    <Link
                      href={`/contribution/${treasury}/${task.escrow?.escrowNftPolicyId}/${task.index}`}
                    >
                      {task.title}
                    </Link>
                  </TableCell>
                  <TableCell className="truncate">{task.description}</TableCell>
                  <TableCell>
                    {task.escrow?.escrowNftPolicyId.substring(0, 6)}...
                  </TableCell>
                  <TableCell>
                    {JSON.stringify(task.acceptanceCriteria)}
                  </TableCell>
                  <TableCell>{formatPosixTime(task.expirationTime)}</TableCell>
                  <TableCell>{parseInt(task.lovelace) / 1000000}</TableCell>
                  <TableCell>
                    <TaskStatusSelect
                      taskId={task.id}
                      currentStatus={task.status}
                    />
                  </TableCell>
                  <TableCell className="items-center justify-center">
                    <DialogTask openButtonSize="sm" id={task.id} />
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
