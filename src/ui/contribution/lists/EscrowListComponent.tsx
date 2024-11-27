import { Button } from "~/components/ui/button";
import { Table, TableHead, TableCell, TableRow } from "~/components/ui/table";
import Link from "next/link";
import { useEscrow } from "~/hooks/contribution/useEscrow";
import DialogEscrow from "~/ui/contribution/dialogs/DialogEscrow";

export default function EscrowListComponent({
  treasuryId,
}: {
  treasuryId: string;
}) {
  // Simple component -> Table
  //

  const { treasuryEscrows, numUnusedTreasuryEscrows } = useEscrow({
    treasuryId,
  });

  return (
    <div>
      {numUnusedTreasuryEscrows > 0 && (
        <div className="mb-2 flex w-full items-center justify-center bg-warning py-2 text-warning-foreground">
          <p>You have unused escrows</p>
        </div>
      )}
      {treasuryEscrows && (
        <Table className="mb-8 w-full table-fixed">
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>CS</TableHead>
            {/* TODO: Do we need Decision Makers? Not if they are solely defined at Treasury Level */}
            {/* <TableHead>Decision Makers</TableHead> */}
            <TableHead>Approved Contributors</TableHead>
            <TableHead>Tasks</TableHead>
            <TableHead>Ada Allocated to Tasks</TableHead>
            <TableHead>Synced?</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>

          <>
            {treasuryEscrows.map((escrow, i) => (
              <TableRow key={i}>
                <TableCell>{escrow?.title}</TableCell>
                <TableCell>
                  {escrow?.escrowNftPolicyId?.substring(0, 6)}...
                </TableCell>
                {/* <TableCell>coming soon</TableCell> */}
                <TableCell>
                  {escrow?.contributorPrerequisites?.length ?? 0}
                </TableCell>
                <TableCell>{escrow?.tasks?.length ?? 0}</TableCell>
                <TableCell>{escrow?.totalAda}</TableCell>
                <TableCell>
                  {escrow?.isSyncedWithNetwork ? "Yes" : "No"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-row gap-1">
                    <Link
                      href={`/app/projects/${treasuryId}/${escrow.escrowNftPolicyId}`}
                    >
                      <Button size="dialog">View</Button>
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
