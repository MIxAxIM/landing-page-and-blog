import { Button } from "~/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "~/components/ui/dialog";
import { api } from "~/utils/api";
import Link from "next/link";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import useAggregateUserInfo from "~/hooks/cardano-indexer-api/network/useAggregateUserInfo";

// WIP 2024-12-13


// NOTE:
// Here is a demo component for prompting the user to take an available action.
// Let's start by implementing a prompt to claim available rewards.
// Then, we can add additional prompts for other actions.

export default function UserActionDialog() {
  const ctx = api.useUtils();
  const { data: sessionData } = useSession();

  const { aggregateUserInfo } = useAggregateUserInfo()

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [taskRoute, setTaskRoute] = useState<string | null>(null);

  // TODO:
  // Options to get this data:
  // - Can we extend Aggregate User Info so that it returns any claimable rewards?
  // - If not can map over Treasuries in aggregateUserInfo, looking for a task that can be claimed (inefficient)
  // - Or, could process the results of /contributor-state/utxos in the TRPC endpoint

  useEffect(() => {
    if (!!aggregateUserInfo) {
      const rewards = aggregateUserInfo.projects.ongoing.filter(project => project.commitment?.status === "APPROVED")
      if (rewards.length > 0) {
        setIsOpen(true);
        setTaskRoute(`/project/${rewards[0]?.policy}/${rewards[0]?.commitment?.task_hash}`);
      }
    }
  }, [aggregateUserInfo])

  if (!sessionData || !aggregateUserInfo) return;

  return (
    <Dialog open={isOpen && !!taskRoute}>
      <DialogContent>
        <DialogHeader className="font-bold">
          You have rewards to claim!
        </DialogHeader>
        <div>
          <p>You are currently working on {aggregateUserInfo.projects.ongoing.length} projects.</p>
          <Link href={taskRoute ?? "/project"}>
            <Button onClick={() => setIsOpen(false)}>
              View Task and Claim Rewards
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
