import { Table, TableHead, TableCell, TableRow } from "~/components/ui/table";
import Link from "next/link";
import { useTask } from "~/hooks/contribution/useTask";
import { formatPosixTime } from "~/utils/time";
import DialogTask from "../../components/dialogs/DialogTask";
import TaskStatusSelect from "../../components/selection/TaskStatusSelect";
import { TaskStatus } from "@prisma/client";
import { useState } from "react";
import TaskStatusFilter from "./TaskStatusFilter";

export default function TaskListComponent({ treasury }: { treasury: string }) {
  const [selectedStatuses, setSelectedStatuses] = useState<TaskStatus[]>(
    Object.values(TaskStatus), // Initialize with all statuses
  );
  const { tasks: filteredTasks } = useTask({
    treasuryNftPolicyId: treasury,
    status: selectedStatuses,
  });

  return (
    <div>
      <div className="mb-4">
        <TaskStatusFilter
          selectedStatuses={selectedStatuses}
          onChange={setSelectedStatuses}
        />
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
