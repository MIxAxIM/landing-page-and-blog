import { useState } from "react";
import MintProjectToken from "~/components/transactions/project-manager/mintProjectToken/MintProjectToken";
import { Task } from "~/types/db"


type ContributorPolicies = {
  contributorPolicy: string;
  projectNFTPolicy: string;
}[]


export default function MintProjectTokenEmbeddedForm(
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


  return (

    <div>
      <h2>Tx Data:</h2>
      <h3>Treasury Nft Policy Id</h3>
      <p>Page will not display without this:
        {" " + treasuryNftPolicyId}
      </p>
      <h3>Contributor Policy Ids:</h3>
      <p>Start with no options - just apply this Contrib to its own Treasury</p>
      <pre>{JSON.stringify(contributorPolicies, null, 2)}</pre>
      <h3>Projects</h3>
      <p>Start by getting 1-of tasks working, then finish implementation of multi-commitments</p>
      {tasksToPublish.map((t) => (
        <div key={t.id}>
          <pre>pdProjectContent_: {t.hash}</pre>
          <pre>pdExpirationTime_: {t.expirationTime}</pre>
          <pre>pdLovelaceAmount_: {t.lovelace}</pre>
          <pre>pdTokens_: []</pre>
          <pre>commitments allowed: {t.numAllowedCommitments} </pre>

        </div>
      ))}
      <h3>Success Tx Hash?</h3>
      Add a Dialog Button and a modal that pops up populating and confirming:
      {!!contributorPolicies[0] && !!datumReadyTasks && (

        <MintProjectToken
          treasuryNftPolicyId={treasuryNftPolicyId}
          contributorsToAdd={[contributorPolicies[0]?.contributorPolicy]}
          projects={JSON.stringify(datumReadyTasks)}
          setSuccessTxHash={setSuccessTxHash}
        />
      )}

    </div>
  )
}
