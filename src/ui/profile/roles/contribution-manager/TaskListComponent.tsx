import { Table, TableHead, TableCell, TableRow } from "~/components/ui/table";
import Link from "next/link";
import { useTask } from "~/hooks/contribution/useTask";
import { formatPosixTime } from "~/utils/time";
import DialogTask from "../../components/dialogs/DialogTask";
import TaskStatusSelect from "../../components/selection/TaskStatusSelect";
import { TaskStatus } from "@prisma/client";
import { useState } from "react";
import TaskStatusFilter from "./TaskStatusFilter";
import { useEscrow } from "~/hooks/contribution/useEscrow";
import TaskEscrowFilter from "./TaskEscrowFilter";

export default function TaskListComponent({ treasury }: { treasury: string }) {
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>(
    Object.values(TaskStatus),
  );

  // Get all escrows for this treasury
  const { escrows } = useEscrow({});
  const treasuryEscrows = escrows.filter((e) => e?.treasuryId === treasury);

  // Escrow filter state - initialize with all escrow IDs
  const [selectedEscrows, setSelectedEscrows] = useState<string[]>(
    treasuryEscrows.map((e) => e?.id ?? ""),
  );

  // Get filtered tasks
  const { tasks } = useTask({
    treasuryNftPolicyId: treasury,
    status: selectedStatuses,
  });

  // Filter tasks by selected escrows
  const filteredTasks = tasks.filter((task) =>
    selectedEscrows.includes(task.escrowId),
  );

  return (
    <div>
      <div className="mb-4">
        <TaskStatusFilter
          selectedStatuses={selectedStatuses}
          onChange={setSelectedStatuses}
        />
        {treasuryEscrows && (
          <TaskEscrowFilter
            escrows={treasuryEscrows.filter(
              (escrow): escrow is NonNullable<typeof escrow> =>
                escrow !== null && escrow.treasuryId === treasury,
            )}
            selectedEscrows={selectedEscrows}
            onChange={setSelectedEscrows}
          />
        )}
      </div>
      {filteredTasks && (
        <Table>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Escrow</TableHead>
            <TableHead>Acceptance Criteria</TableHead>
            <TableHead>Expiration Time</TableHead>
            <TableHead>Ada</TableHead>
          </TableRow>

          <>
            {filteredTasks.map((task, i) => (
              <TableRow key={i}>
                <TableCell>{task?.index}</TableCell>
                <TableCell>
                  <Link
                    href={`/contribution/${treasury}/${task.escrow?.escrowNftPolicyId}/${task.index}`}
                  >
                    {task?.title}
                  </Link>
                </TableCell>
                <TableCell>{task?.description}</TableCell>
                <TableCell>
                  {task.escrow?.escrowNftPolicyId.substring(0, 6)}...
                </TableCell>
                <TableCell>
                  {JSON.stringify(task?.acceptanceCriteria)}
                </TableCell>
                <TableCell>{formatPosixTime(task.expirationTime)}</TableCell>
                <TableCell>{parseInt(task.lovelace) / 1000000}</TableCell>
                <TableCell>
                  <TaskStatusSelect
                    taskId={task.id}
                    currentStatus={task.status}
                  />
                </TableCell>
                <TableCell>
                  <DialogTask id={task.id} />
                </TableCell>
              </TableRow>
            ))}
          </>
        </Table>
      )}
    </div>
  );
}
