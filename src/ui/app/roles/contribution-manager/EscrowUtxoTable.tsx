
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { DecodedEscrowUtxo } from "~/server/api/routers/cardano-indexer/project/escrow"
import CopyableTruncatedHash from "~/components/ui/CopyableHash"
import AcceptProjectDialog from "~/components/cardano/tx/project-manager/accept-project/AcceptProjectDialog"
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken"
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment"
import { stringToHex } from "@meshsdk/common"
import { useEffect, useState } from "react"

export default function EscrowUtxoTable({ utxos, treasuryNftPolicyId }: { utxos: DecodedEscrowUtxo[], treasuryNftPolicyId: string }) {
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
          contributorAlias: dbTC?.contributorId ?? "Unknown",
          taskCommitmentId: dbTC?.id,
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
              <TableHead>Task Hash</TableHead>
              <TableHead>Contributor</TableHead>
              <TableHead>Amount (₳)</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Slot</TableHead>
              <TableHead>Tx Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matchedTaskCommitmentsToUtxos.map((tx) => (
              <TableRow key={`${tx.txHash}-${tx.index}`}>
                <TableCell>
                  <CopyableTruncatedHash hash={tx.datum.projectData.taskHash} />
                </TableCell>
                <TableCell>{tx.contributorAlias}</TableCell>
                <TableCell>
                  {formatAda(tx.datum.projectData.lovelace)}
                </TableCell>
                <TableCell>
                  {formatDate(tx.datum.projectData.expirationTime)}
                </TableCell>
                <TableCell>{tx.slot}</TableCell>
                <TableCell className="font-mono">
                  <CopyableTruncatedHash hash={tx.txHash} />
                </TableCell>
                <TableCell>

                  <AcceptProjectDialog
                    taskCommitmentId={""}
                    treasuryNftPolicyId={treasuryNftPolicyId}
                    contributorAlias={tx.contributorAlias}
                    userAccessTokenUnit={accessTokenAsset?.unit ?? ""}
                  />
                </TableCell>
                <TableCell>
                  {tx.taskCommitmentId ?? "No Alias"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}


