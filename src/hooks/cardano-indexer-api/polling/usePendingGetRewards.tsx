import { useState, useEffect } from 'react';
import { api } from "~/utils/api";
import { TaskCommitmentStatus } from "@prisma/client";
import { useTaskCommitment } from '~/hooks/db/contribution/useTaskCommitment';
import { useAccessToken } from '../network/useAccessToken';

// We know the rewards have been claimed if there is once again a quantity of 2 tokens in contributor-state/utxos -> asset[1]
// Build a router endpoint for this...?

export function usePendingGetRewards(treasuryNftPolicyId: string) {
	const [isChecking, setIsChecking] = useState(false);
	const ctx = api.useUtils();
	const { accessTokenAlias } = useAccessToken()

	// Get all Commitments for current treasury
	const { data: pendingRewardsToClaim, isLoading } = api.taskCommitment.getTaskCommitmentsByTreasury.useQuery({
		treasuryNftPolicyId: treasuryNftPolicyId,
		status: TaskCommitmentStatus.PENDING_TX_GET_REWARDS
	});

	// Task Commitment Status mutation
	const { updateTaskCommitmentStatus } = useTaskCommitment({});

	// Source of cardano on-chain data -> Escrow UTxOs
	const { data: contribAssets } = api.contributorState.getContributorStateAssetsByAlias.useQuery(
		{ treasuryNftPolicyId: treasuryNftPolicyId, alias: accessTokenAlias ?? "" },
		{
			enabled: !!treasuryNftPolicyId && treasuryNftPolicyId.length === 56 && !!pendingRewardsToClaim && pendingRewardsToClaim.length > 0,
			refetchInterval: 10000,
			onSuccess: async () => {
				await Promise.all([
					ctx.taskCommitment.getTaskCommitmentsByTreasury.invalidate({ treasuryNftPolicyId }),
					ctx.treasuryValidator.getTreasuryInfo.invalidate({ treasuryNftPolicyId }),
				])
			}
		}
	);

	useEffect(() => {
		if (!contribAssets || !pendingRewardsToClaim) return;

		setIsChecking(true);

		for (const commitment of pendingRewardsToClaim) {
			// if we cannot find an escrow utxo, assume that commitment was accepted 
			// -> remember that the only way db changes to PENDING_TX_COMMITMENT_ACCEPTED is a successful tx
			if (contribAssets && !!contribAssets[1] && contribAssets[1].amount === "2") {
				updateTaskCommitmentStatus({
					id: commitment.id,
					status: TaskCommitmentStatus.REWARDS_CLAIMED
				});
			}
		}
	}, [contribAssets, pendingRewardsToClaim, updateTaskCommitmentStatus]);

	return { isChecking, isLoading };
}
