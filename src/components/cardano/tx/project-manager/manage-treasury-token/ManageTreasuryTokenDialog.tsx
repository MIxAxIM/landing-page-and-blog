
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { Task } from "~/types/db"
import { formatPosixTime } from "~/utils/time";
import { Button } from "~/components/ui/button";
import ManageTreasuryToken from "./ManageTreasuryToken";

type ContributorPolicies = {
  contributorPolicy: string;
  projectNFTPolicy: string;
}[]

export default function ManageTreasuryTokenDialog(
  {
    treasuryNftPolicyId,
    tasksToManage,
    contributorPolicies
  }: {
    treasuryNftPolicyId: string,
    tasksToManage: Task[],
    contributorPolicies: ContributorPolicies
  }) {
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const datumReadyTasks = tasksToManage.map(t => {
    return (
      [
        {
          pdProjectContent_: t.taskHash,
          pdExpirationTime_: parseInt(t.expirationTime),
          pdLovelaceAmount_: parseInt(t.lovelace),
          pdTokens_: [],
        },
        t.numAllowedCommitments,
      ]
    )
  }
  )

  const taskIds = tasksToManage.map(t => t.id)


  // TODO: 2024-12-13
  // Contribution manager can remove on-chain tasks by deselecting them in the list.

  return (
    <Dialog>
      <DialogTrigger className="m-0 p-0">
        <Button>Update Approved Tasks on Andamio Network</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl border-l-[10px] border-secondary">
        <div className="grid grid-cols-2 gap-8">
          <div className="p-2">

            <h3>Projects</h3>
            <Table className="w-full">
              <TableCaption>These tasks will be added.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead></TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Ada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasksToManage.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-bold">{t.title}</TableCell>
                    <TableCell>{formatPosixTime(t.expirationTime)}</TableCell>
                    <TableCell>{parseInt(t.lovelace) / 1000000}</TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </div>
          <div className="p-2">
            {!!contributorPolicies[0] && !!datumReadyTasks && (
              <ManageTreasuryToken
                treasuryNftPolicyId={treasuryNftPolicyId}
                contributorsToAdd={[contributorPolicies[0]?.contributorPolicy]}
                projects={JSON.stringify(datumReadyTasks)}
                setSuccessTxHash={setSuccessTxHash}
                taskIds={taskIds}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>

  )
}
