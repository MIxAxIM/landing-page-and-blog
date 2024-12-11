
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";
import GetRewards from "./GetRewards";

export default function GetRewardsDialog({
	treasuryNftPolicyId,
}: {
	treasuryNftPolicyId: string;
}) {
	const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
		undefined,
	);

	return (
		<Dialog>
			<DialogTrigger className="m-0 p-0">
				<Button size="sm">Claim Rewards</Button>
			</DialogTrigger>
			<DialogContent>
				<h3>Claim Rewards</h3>
				<p className="prose">
					Claim rewards for completing tasks.
				</p>
				<GetRewards
					treasuryNftPolicyId={treasuryNftPolicyId}
					setSuccessTxHash={setSuccessTxHash}
				/>
			</DialogContent>
		</Dialog>
	);
}
