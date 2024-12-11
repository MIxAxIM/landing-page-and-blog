import { useState, useEffect } from 'react';
import { api } from "~/utils/api";
import { TaskCommitmentStatus } from "@prisma/client";
import { useTaskCommitment } from '~/hooks/db/contribution/useTaskCommitment';
import { stringToHex } from '@meshsdk/common';

export function usePendingAcceptProjectCheck(treasuryNftPolicyId: string) {
	const [isChecking, setIsChecking] = useState(false);
	const ctx = api.useUtils();

	// Get all Commitments for current treasury
	const { data: pendingAcceptedCommitments, isLoading } = api.taskCommitment.getTaskCommitmentsByTreasury.useQuery({ treasuryNftPolicyId: treasuryNftPolicyId, status: TaskCommitmentStatus.PENDING_TX_COMMITMENT_ACCEPTED });

	// Task Commitment Status mutation
	const { updateTaskCommitmentStatus } = useTaskCommitment({});

	// Source of cardano on-chain data -> Escrow UTxOs
	const { data: escrowUtxos } = api.escrowValidator.getAllEscrowUtxosByTreasury.useQuery(
		{ treasuryNftPolicyId },
		{
			enabled: !!treasuryNftPolicyId && treasuryNftPolicyId.length === 56 && !!pendingAcceptedCommitments && pendingAcceptedCommitments.length > 0,
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
		if (!escrowUtxos || !pendingAcceptedCommitments) return;

		setIsChecking(true);

		for (const commitment of pendingAcceptedCommitments) {
			// if we cannot find an escrow utxo, assume that commitment was accepted 
			// -> remember that the only way db changes to PENDING_TX_COMMITMENT_ACCEPTED is a successful tx
			if (commitment.task.taskHash && !escrowUtxos.find(
				escrow => escrow.datum.projectData.taskHash === stringToHex(commitment.task.taskHash ?? "")
			)) {
				updateTaskCommitmentStatus({
					id: commitment.id,
					status: TaskCommitmentStatus.COMMITMENT_ACCEPTED
				});
			}
		}
	}, [escrowUtxos, pendingAcceptedCommitments, updateTaskCommitmentStatus]);

	return { isChecking, isLoading };
}
