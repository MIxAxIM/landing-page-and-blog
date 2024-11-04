import { Button } from "~/components/ui/button";
import { useEscrow } from "~/hooks/contribution/useEscrow";

export default function SyncEscrowButton({ id }: { id: string }) {
  const { updateEscrowSyncStatus } = useEscrow({ id: id });

  // TODO:
  // 1. In addition to syncing contributor policy ids, we must also sync Tasks
  // 2. Show a Dialog with staged changes
  // 3. Confirm each change by checking a box
  // 4. Update status of each included Task from APPROVED to ONCHAIN

  const handleClick = () => {
    updateEscrowSyncStatus({
      id: id,
      isSyncedWithNetwork: true,
    });
  };

  return (
    <Button size="sm" onClick={handleClick}>
      Sync Escrow
    </Button>
  );
}
