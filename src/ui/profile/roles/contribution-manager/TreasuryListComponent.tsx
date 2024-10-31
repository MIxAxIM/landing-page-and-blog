import { Button } from "~/components/ui/button";
import { Table, TableHead, TableCell, TableRow } from "~/components/ui/table";
import useTreasuries from "~/hooks/contribution/useTreasuries";
import { type Treasury } from "~/types/db";
import Link from "next/link";

export default function TreasuryListComponent() {
  const { treasuries, isLoadingTreasuries } = useTreasuries();

  // Simple component -> Table
  return (
    <div>
      <h1>Treasury List</h1>
      {isLoadingTreasuries && "loading"}
      {treasuries && (
        <Table>
          <TableRow>
            <TableHead>Treasury</TableHead>
            <TableHead>Policy Id</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead>Balance (ADA)</TableHead>
            <TableHead>Contributors</TableHead>
            <TableHead></TableHead>
          </TableRow>

          {treasuries.map((t: Treasury, i) => (
            <TableRow key={i}>
              <TableCell>{t.title}</TableCell>
              <TableCell>{t.treasuryNftPolicyId.substring(0, 6)}...</TableCell>
              <TableCell>7</TableCell>
              <TableCell>875</TableCell>
              <TableCell>12</TableCell>
              <TableCell>
                <Link
                  href={`/dashboard/contribution-manager/${t.treasuryNftPolicyId}`}
                >
                  <Button size="sm">View</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      )}
    </div>
  );
}
