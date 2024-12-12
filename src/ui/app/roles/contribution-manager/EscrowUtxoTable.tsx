
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { DecodedEscrowUtxo } from "~/server/api/routers/cardano-indexer/project/escrow"
import CopyableTruncatedHash from "~/components/ui/CopyableHash"
import AcceptProjectDialog from "~/components/cardano/tx/project-manager/accept-project/AcceptProjectDialog"
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken"
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment"
import { hexToString, stringToHex } from "@meshsdk/common"
import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import DenyProjectDialog from "~/components/cardano/tx/project-manager/deny-project/DenyProjectDialog"
import { usePendingAcceptProjectCheck } from "~/hooks/cardano-indexer-api/polling/usePendingAcceptProjectCheck"
import { usePendingCommitProjectCheck } from "~/hooks/cardano-indexer-api/polling/usePendingCommitProjectCheck"
import { usePendingGetRewards } from "~/hooks/cardano-indexer-api/polling/usePendingGetRewards"
import Link from "next/link"

export default function EscrowUtxoTable({ utxos, treasuryNftPolicyId }: { utxos: DecodedEscrowUtxo[], treasuryNftPolicyId: string }) {
  usePendingAcceptProjectCheck(treasuryNftPolicyId)
  usePendingCommitProjectCheck(treasuryNftPolicyId)
  usePendingGetRewards(treasuryNftPolicyId)

  const { accessTokenAsset } = useAccessToken()
  const { taskCommitmentsByTreasury } = useTaskCommitment({ treasuryNftPolicyId: treasuryNftPolicyId })

  const [matchedTaskCommitmentsToUtxos, setMatchedTaskCommitmentsToUtxos] = useState<any[]>([])

  useEffect(() => {
    const _matchedTaskCommitmentsToUtxos = utxos.map((utxo) => {

      if (!!taskCommitmentsByTreasury) {

        console.log("hello?", taskCommitmentsByTreasury)
        const dbTC = taskCommitmentsByTreasury.find((tc) => stringToHex(tc?.task.taskHash ?? "") === utxo.datum.projectData.taskHash)

        console.log("dbTC", dbTC)

        return {
          ...utxo,
          contributorUsernameInDb: dbTC?.contributor.user.name ?? "Unknown",
          taskCommitmentId: dbTC?.id,
          taskId: dbTC?.task.id,
          taskTitle: dbTC?.task.title,
          hash: dbTC?.task.hash,
        }

      }
    })

    setMatchedTaskCommitmentsToUtxos(_matchedTaskCommitmentsToUtxos)


  }, [utxos, taskCommitmentsByTreasury])


  const formatDate = (timestamp: number) => new Date(timestamp).toLocaleDateString()
  const formatAda = (lovelace: number) => (lovelace / 1_000_000).toFixed(2)
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Current Commitments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Title</TableHead>
              <TableHead>Contributor</TableHead>
              <TableHead>Amount (₳)</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Task Hash</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matchedTaskCommitmentsToUtxos.map((tx) => (
              <TableRow key={`${tx.txHash}-${tx.index}`}>
                <TableCell>
                  {tx.taskTitle ?? "not found"}
                </TableCell>
                <TableCell>{tx.contributorAlias}</TableCell>
                <TableCell>
                  {formatAda(tx.datum.projectData.lovelace)}
                </TableCell>
                <TableCell>
                  {formatDate(tx.datum.projectData.expirationTime)}
                </TableCell>
                <TableCell>
                  <CopyableTruncatedHash hash={hexToString(tx.datum.projectData.taskHash)} />
                </TableCell>
                <TableCell>
                  <div className="flex w-full gap-x-2 items-center h-full">
                    <AcceptProjectDialog
                      taskCommitmentId={tx.taskCommitmentId}
                      treasuryNftPolicyId={treasuryNftPolicyId}
                      contributorAlias={tx.contributorAlias}
                      userAccessTokenUnit={accessTokenAsset?.unit ?? ""}
                    />
                    <DenyProjectDialog
                      taskCommitmentId={tx.taskCommitmentId}
                      treasuryNftPolicyId={treasuryNftPolicyId}
                      contributorAlias={tx.contributorAlias}
                      userAccessTokenUnit={accessTokenAsset?.unit ?? ""}
                    />
                    <Link href={`/app/project/${treasuryNftPolicyId}/${tx.taskId}`}>
                      <Button size="sm">View Conversation</Button>
                    </Link>
                    <Button size="sm">View Public Task Page</Button>


                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}


