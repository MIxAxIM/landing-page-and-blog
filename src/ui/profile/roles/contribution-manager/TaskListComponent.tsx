import { Button } from "~/components/ui/button";
import { Table, TableHead, TableCell, TableRow } from "~/components/ui/table";
import Link from "next/link";
import { useTask } from "~/hooks/contribution/useTask";

export default function TaskListComponent({ treasury }: { treasury: string }) {
  const { tasks } = useTask({ treasuryNftPolicyId: treasury });
  // Simple component -> Table
  return (
    <div>
      {tasks && (
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
            {tasks.map((task, i) => (
              <TableRow key={i}>
                <TableCell>{task?.index}</TableCell>
                <TableCell>{task?.title}</TableCell>
                <TableCell>{task?.description}</TableCell>
                <TableCell>
                  {task.escrow?.escrowNftPolicyId.substring(0, 6)}...
                </TableCell>
                <TableCell>
                  {JSON.stringify(task?.acceptanceCriteria)}
                </TableCell>
                <TableCell>2024-12-01</TableCell>
                <TableCell>50</TableCell>
                <TableCell>
                  <Link href={`#`}>
                    <Button size="sm">View Details</Button>
                  </Link>
                </TableCell>
                <TableCell>
                  <Button size="sm">Edit Task</Button>
                </TableCell>
              </TableRow>
            ))}
          </>
        </Table>
      )}
    </div>
  );
}
