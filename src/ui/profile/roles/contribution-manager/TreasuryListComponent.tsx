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
      {isLoadingTreasuries && "loading"}
      {treasuries && (
        <Table>
          <TableRow>
            <TableHead>Treasury</TableHead>
            <TableHead>Policy Id</TableHead>
            <TableHead>Total Tasks</TableHead>
            <TableHead>Balance (ADA)</TableHead>
            <TableHead>Contributors</TableHead>
            <TableHead>Escrows</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>

          {treasuries.map((t: Treasury, i) => (
            <>
              {!!t && (
                <TableRow key={i}>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>
                    {t.treasuryNftPolicyId.substring(0, 6)}...
                  </TableCell>
                  <TableCell>{t.totalTasks}</TableCell>
                  <TableCell>{t.totalAda}</TableCell>
                  <TableCell>12</TableCell>
                  <TableCell>{t._count.escrows}</TableCell>
                  <TableCell>
                    <Link
                      href={`/dashboard/contribution-manager/${t.treasuryNftPolicyId}`}
                    >
                      <Button size="sm">View</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </Table>
      )}
    </div>
  );
}
