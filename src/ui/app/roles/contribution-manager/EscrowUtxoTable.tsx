
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { DecodedEscrowUtxo } from "~/server/api/routers/cardano-indexer/project/escrow"
import CopyableTruncatedHash from "~/components/ui/CopyableHash"
import AcceptProjectDialog from "~/components/cardano/tx/project-manager/accept-project/AcceptProjectDialog"
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken"
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment"
import { hexToString, stringToHex } from "@meshsdk/common"
import { useMemo } from "react"
import { Button } from "~/components/ui/button"
import DenyProjectDialog from "~/components/cardano/tx/project-manager/deny-project/DenyProjectDialog"
import { usePendingAcceptProjectCheck } from "~/hooks/cardano-indexer-api/polling/usePendingAcceptProjectCheck"
import { usePendingCommitProjectCheck } from "~/hooks/cardano-indexer-api/polling/usePendingCommitProjectCheck"
import { usePendingGetRewards } from "~/hooks/cardano-indexer-api/polling/usePendingGetRewards"
import Link from "next/link"
import { Content, EditorContent, useEditor } from "@tiptap/react"
import { ExtensionKit } from "~/components/editor/extension-kit"
import { EditableCodeBlock } from "~/components/editor/extensions/CodeBlock"
import { usePendingAddInfoCheck } from "~/hooks/cardano-indexer-api/polling/usePendingAddInfoCheck"

export default function EscrowUtxoTable({ utxos, treasuryNftPolicyId }: { utxos: DecodedEscrowUtxo[], treasuryNftPolicyId: string }) {
  usePendingAcceptProjectCheck(treasuryNftPolicyId)
  usePendingCommitProjectCheck(treasuryNftPolicyId)
  usePendingGetRewards(treasuryNftPolicyId)
  usePendingAddInfoCheck(treasuryNftPolicyId)

  const { accessTokenAsset } = useAccessToken()
  const { taskCommitmentsByTreasury } = useTaskCommitment({ treasuryNftPolicyId: treasuryNftPolicyId })


  // Memoize the matched task commitments to prevent unnecessary recalculations
  const matchedTaskCommitmentsToUtxos = useMemo(() => {
    if (!taskCommitmentsByTreasury) return [];

    return utxos.map((utxo) => {
      const dbTC = taskCommitmentsByTreasury.find(
        (tc) => stringToHex(tc?.task.taskHash ?? "") === utxo.datum.projectData.taskHash
      );

      return {
        ...utxo,
        contributorUsernameInDb: dbTC?.contributor.user.name ?? "Unknown",
        taskCommitmentId: dbTC?.id,
        taskId: dbTC?.task.id,
        taskTitle: dbTC?.task.title,
        hash: dbTC?.task.hash,
        evidence: dbTC?.evidence,
      };
    });
  }, [utxos, taskCommitmentsByTreasury]);


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
                      taskCommitmentId={tx.taskCommitmentId ?? ""}
                      treasuryNftPolicyId={treasuryNftPolicyId}
                      contributorAlias={tx.contributorAlias}
                      userAccessTokenUnit={accessTokenAsset?.unit ?? ""}
                    />
                    <DenyProjectDialog
                      taskCommitmentId={tx.taskCommitmentId ?? ""}
                      treasuryNftPolicyId={treasuryNftPolicyId}
                      contributorAlias={tx.contributorAlias}
                      userAccessTokenUnit={accessTokenAsset?.unit ?? ""}
                    />
                    <Link href={`/app/project/${treasuryNftPolicyId}/${tx.taskId}`}>
                      <Button size="sm">View Conversation</Button>
                    </Link>
                    <Button size="sm">View Public Task Page</Button>
                    <Link href={`/app/testing/${treasuryNftPolicyId}/${tx.hash}/${tx.contributorAlias}`}>
                      <Button size="sm">View Current Commitment</Button>
                    </Link>


                  </div>
                </TableCell>
                <div>

                </div>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {matchedTaskCommitmentsToUtxos.length === 1 && !!matchedTaskCommitmentsToUtxos[0] && !!matchedTaskCommitmentsToUtxos[0].evidence && (
          <ReadEvidenceContent content={matchedTaskCommitmentsToUtxos[0].evidence as Content} />
        )}
      </CardContent>
    </Card >
  )
}

export function ReadEvidenceContent({ content }: { content: Content }) {
  const editor = useEditor({
    extensions: [...ExtensionKit(), EditableCodeBlock],
    content: content,
    editable: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg prose-headings:font-title font-default focus:outline-none max-w-full text-foreground prose-headings:text-foreground",
      },
    },
  });

  return <>{editor && <EditorContent editor={editor} />}</>;
}
