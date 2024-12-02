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
import MintProjectToken from "./MintProjectToken";


type ContributorPolicies = {
  contributorPolicy: string;
  projectNFTPolicy: string;
}[]


export default function MintProjectTokenDialog(
  {
    treasuryNftPolicyId,
    tasksToPublish,
    contributorPolicies
  }: {
    treasuryNftPolicyId: string,
    tasksToPublish: Task[],
    contributorPolicies: ContributorPolicies
  }) {
  const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
    undefined,
  );

  const datumReadyTasks = tasksToPublish.map(t => {
    return (
      [
        {
          pdProjectContent_: t.hash,
          pdExpirationTime_: parseInt(t.expirationTime),
          pdLovelaceAmount_: parseInt(t.lovelace),
          pdTokens_: [],
        },
        t.numAllowedCommitments,
      ]
    )
  }
  )

  const taskIds = tasksToPublish.map(t => t.id)

  // NOTE: (updated 2024-11-27)
  // Start with one-of tasks working. Then implement multi-commitments according to user stories
  // Start with automatic assignment of contributorPolicy to Project Token.
  //  - Strategic Alignment: make a plan for how to roll out shared contributor features

  // When ready:
  //  <TableHead className="text-right"># Commitments</TableHead>
  //  <TableCell>{t.numAllowedCommitments}</TableCell>

  return (
    <Dialog>
      <DialogTrigger className="m-0 p-0">
        <Button>Publish Approved Tasks on Andamio Network</Button>
      </DialogTrigger>
      <DialogContent>
        <div>
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
              {tasksToPublish.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-bold">{t.title}</TableCell>
                  <TableCell>{formatPosixTime(t.expirationTime)}</TableCell>
                  <TableCell>{parseInt(t.lovelace) / 1000000}</TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
          <div className="mt-8 justify-center">
            {!!contributorPolicies[0] && !!datumReadyTasks && (
              <MintProjectToken
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
