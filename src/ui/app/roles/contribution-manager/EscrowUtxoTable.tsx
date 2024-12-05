
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { DecodedEscrowUtxo } from "~/server/api/routers/cardano-indexer/project/escrow"
import CopyableTruncatedHash from "~/components/ui/CopyableHash"

export default function EscrowUtxoTable({ utxos }: { utxos: DecodedEscrowUtxo[] }) {
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
            {utxos.map((tx) => (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}


