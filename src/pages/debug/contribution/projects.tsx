import { useEffect, useState } from "react";
import useTreasuries from "~/hooks/contribution/useTreasuries";
import useProjects from "~/hooks/onchain/useProjects";
import useTreasuryInstances from "~/hooks/onchain/useTreasuryInstances";
import { Treasury } from "~/types/db"; import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export default function DebugProjectsPage() {

  const { treasuryInstances } = useTreasuryInstances()
  const { treasuries } = useTreasuries()

  const [publicTreasuries, setPublicTreasuries] = useState<Treasury[]>([])
  const [currentTreasury, setCurrentTreasury] = useState<Treasury | undefined>(undefined)

  const {
    contributorStateUtxos,
    contributorPolicies,
    escrowUtxos,
    treasuryUtxos,
    treasuryInfo,
  } = useProjects({ treasuryNftPolicyId: currentTreasury?.treasuryNftPolicyId ?? undefined })


  useEffect(() => {

    if (!!treasuryInstances && !!treasuries) {
      const _treasuries = treasuries.filter(t => (
        !!t.treasuryNftPolicyId && treasuryInstances.policies.includes(t.treasuryNftPolicyId))
      )
      setPublicTreasuries(_treasuries)
    }
  }, [treasuryInstances, treasuries])

  return (
    <div className="w-11/12 mx-auto my-24 text-[8pt]">
      <Select onValueChange={(value) => {
        const selected = publicTreasuries.find(t => t.treasuryNftPolicyId === value);
        setCurrentTreasury(selected);
      }}>
        <SelectTrigger className="w-[500px]">
          <SelectValue placeholder="Select a Public (on-chain) Treasury" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {publicTreasuries?.map(pt => (
              <SelectItem value={pt.treasuryNftPolicyId ?? ""} key={pt.id}>{pt.title}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <pre>{JSON.stringify(currentTreasury, null, 2)}</pre>
      <h2>Contributor State Utxos</h2>
      <pre>{JSON.stringify(contributorStateUtxos, null, 2)}</pre>
      <h2>Contributor Policies</h2>
      <pre>{JSON.stringify(contributorPolicies, null, 2)}</pre>
      <h2>Escrow Utxos</h2>
      <pre>{JSON.stringify(escrowUtxos, null, 2)}</pre>
      <h2>Treasury Utxos</h2>
      <pre>{JSON.stringify(treasuryUtxos, null, 2)}</pre>
      <h2>Treasury Info</h2>
      <pre>{JSON.stringify(treasuryInfo, null, 2)}</pre>
    </div>
  )
}

