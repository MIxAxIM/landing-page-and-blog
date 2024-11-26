import useProjects from "~/hooks/onchain/useProjects";
import useTreasuryInstances from "~/hooks/onchain/useTreasuryInstances";

export default function DebugProjectsPage() {

  const { treasuryInstances } = useTreasuryInstances()

  //const {
  //  contributorStateUtxos,
  //  contributorPolicies,
  //  escrowUtxos,
  //  treasuryUtxos,
  //  treasuryInfo,
  //} = useProjects()

  return (
    <div className="w-11/12 mx-auto my-24">
      <pre>{JSON.stringify(treasuryInstances, null, 2)}</pre>
    </div>
  )
}

//<pre>{JSON.stringify(contributorStateUtxos, null, 2)}</pre>
//<pre>{JSON.stringify(contributorPolicies, null, 2)}</pre>
//<pre>{JSON.stringify(escrowUtxos, null, 2)}</pre>
//<pre>{JSON.stringify(treasuryUtxos, null, 2)}</pre>
//<pre>{JSON.stringify(treasuryInfo, null, 2)}</pre>
