import { type UtxoWithSlot } from "@maestro-org/typescript-sdk";
import { hexToString } from "@meshsdk/common";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import useProjectByTreasury from "~/hooks/cardano-indexer-api/project/useProjectByTreasury";

export default function EnrolledContributors({ treasuryNftPolicyId }: { treasuryNftPolicyId?: string | null }) {

  const { contributorPolicies, contributorStateUtxos } = useProjectByTreasury({ treasuryNftPolicyId: treasuryNftPolicyId ?? undefined })

  return (

    <Card>
      <CardHeader>
        <CardTitle>Enrolled Contributors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-5">
          <div className="col-span-1">
            <ul>
              {contributorStateUtxos?.map((utxo: UtxoWithSlot) => (
                <li key={utxo.tx_hash}>
                  {hexToString(utxo?.assets[1]?.unit.substring(56) ?? "")}
                </li>

              ))}
            </ul>

          </div>
          <div className="col-span-2">

            <p>Contributor Policy Id: <span className="font-mono">{contributorPolicies && contributorPolicies[0]?.contributorPolicy}</span></p>
            <p>Project NFT Policy Id: <span className="font-mono">{contributorPolicies && contributorPolicies[0]?.projectNFTPolicy}</span></p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
