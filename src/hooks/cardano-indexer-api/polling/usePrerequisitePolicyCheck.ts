import { useState, useEffect } from 'react';
import { api } from "~/utils/api";
import { useContributorPrerequisite } from '~/hooks/db/contribution/useContributorPrerequisite';

export function usePrerequisitePolicyCheck(treasuryNftPolicyId: string) {
  const [isChecking, setIsChecking] = useState(false);

  // Get all prerequisites with "awaiting" policy ID
  const { data: awaitingPrerequisites, isLoading } = api.contributorPrerequisite.getPrerequisites.useQuery(
    undefined,
    {
      select: (prerequisites) => prerequisites.filter(p => p.contributorPolicyId === "awaiting")
    }
  );

  // Prerequisite mutation
  const { updatePrerequisitePolicy } = useContributorPrerequisite({});

  // Query to get on-chain data
  // Note: This is a placeholder - you'll need to specify the actual query
  const { data: onchainPolicies } = api.contributorState.getContributorPolicies.useQuery(
    { treasuryNftPolicyId: treasuryNftPolicyId },
    {
      enabled: !!awaitingPrerequisites && awaitingPrerequisites.length > 0,
      refetchInterval: 10000
    }
  );

  useEffect(() => {
    if (!onchainPolicies || !awaitingPrerequisites) return;

    setIsChecking(true);

    for (const prerequisite of awaitingPrerequisites) {
      // TODO: Replace this condition with actual on-chain data check
      const matchingPolicy = onchainPolicies.find(policy => policy.projectNFTPolicy === treasuryNftPolicyId);

      if (matchingPolicy) {
        updatePrerequisitePolicy({
          id: prerequisite.id,
          contributorPolicyId: matchingPolicy.contributorPolicy // or however you want to format the policy ID
        });
      }
    }
  }, [onchainPolicies, awaitingPrerequisites, updatePrerequisitePolicy]);

  return { isChecking, isLoading };
}
