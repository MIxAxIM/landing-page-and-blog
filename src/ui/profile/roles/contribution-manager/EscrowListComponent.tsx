import { Button } from "~/components/ui/button";
import { Table, TableHead, TableCell, TableRow } from "~/components/ui/table";
import { type Escrow } from "~/types/db";
import Link from "next/link";

export default function EscrowListComponent({
  escrows,
}: {
  escrows: Escrow[];
}) {
  // Simple component -> Table
  return (
    <div>
      {escrows && (
        <Table>
          <TableRow>
            <TableHead>Escrow</TableHead>
            <TableHead>CS</TableHead>
            <TableHead>Decision Makers</TableHead>
            <TableHead>Approved Contributor Policy IDs</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead>Funds Locked</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>

          <>
            {escrows.map((escrow, i) => (
              <TableRow key={i}>
                <TableCell>{escrow?.title}</TableCell>
                <TableCell>
                  {escrow?.escrowNftPolicyId.substring(0, 6)}...
                </TableCell>
                <TableCell>coming soon</TableCell>
                <TableCell>{escrow?.contributorPolicyIds.length}</TableCell>
                <TableCell>{escrow?.tasks.length}</TableCell>
                <TableCell>1000</TableCell>
                <TableCell>
                  <Link href={`#`}>
                    <Button size="sm">View All</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </>
        </Table>
      )}
    </div>
  );
}
