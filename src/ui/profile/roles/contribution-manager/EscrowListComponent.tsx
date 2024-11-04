import { Button } from "~/components/ui/button";
import { Table, TableHead, TableCell, TableRow } from "~/components/ui/table";
import Link from "next/link";
import { useEscrow } from "~/hooks/contribution/useEscrow";
import DialogEscrow from "../../components/dialogs/DialogEscrow";
import SyncEscrowButton from "../../components/buttons/SyncEscrowButton";
import DialogPublishEscrow from "../../components/dialogs/DialogPublishEscrowTx";

export default function EscrowListComponent({
  treasuryNftPolicyId,
}: {
  treasuryNftPolicyId: string;
}) {
  // Simple component -> Table
  //

  const { treasuryEscrows, numUnusedTreasuryEscrows } = useEscrow({
    treasuryNftPolicyId,
  });

  return (
    <div>
      {numUnusedTreasuryEscrows > 0 && (
        <div className="mb-2 flex w-full items-center justify-center bg-warning py-2 text-warning-foreground">
          <p>You have unused escrows</p>
        </div>
      )}
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
            <TableHead>Synced?</TableHead>
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
                  {escrow?.isSyncedWithNetwork ? "Yes" : "No"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-row gap-1">
                    <Link href={`#`}>
                      <Button size="sm">View All</Button>
                    </Link>
                    <DialogEscrow id={escrow?.id} openButtonSize="sm" />
                    {!!escrow?.id && <DialogPublishEscrow id={escrow.id} />}
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
