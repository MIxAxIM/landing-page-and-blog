import { Button } from "~/components/ui/button";
import { Table, TableHead, TableCell, TableRow } from "~/components/ui/table";
import Link from "next/link";
import { useEscrow } from "~/hooks/contribution/useEscrow";
import DialogEscrow from "../../components/dialogs/DialogEscrow";

export default function EscrowListComponent({
  treasuryNftPolicyId,
}: {
  treasuryNftPolicyId: string;
}) {
  // Simple component -> Table
  //

  const { treasuryEscrows } = useEscrow({ treasuryNftPolicyId });

  return (
    <div>
      {treasuryEscrows && (
        <Table>
          <TableRow>
            <TableHead>Escrow</TableHead>
            <TableHead>CS</TableHead>
            {/* TODO: Do we need Decision Makers? Not if they are solely defined at Treasury Level */}
            {/* <TableHead>Decision Makers</TableHead> */}
            <TableHead>Approved Contributor Policy IDs</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead>Ada Allocated to Tasks</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>

          <>
            {treasuryEscrows.map((escrow, i) => (
              <TableRow key={i}>
                <TableCell>{escrow?.title}</TableCell>
                <TableCell>
                  {escrow?.escrowNftPolicyId.substring(0, 6)}...
                </TableCell>
                {/* <TableCell>coming soon</TableCell> */}
                <TableCell>{escrow?.contributorPolicyIds.length}</TableCell>
                <TableCell>{escrow?.tasks?.length ?? 0}</TableCell>
                <TableCell>{escrow?.totalAda}</TableCell>
                <TableCell>
                  <div className="flex flex-row gap-1">
                    <Link href={`#`}>
                      <Button size="sm">View All</Button>
                    </Link>
                    <DialogEscrow id={escrow?.id} openButtonSize="sm" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </>
        </Table>
      )}
    </div>
  );
}
