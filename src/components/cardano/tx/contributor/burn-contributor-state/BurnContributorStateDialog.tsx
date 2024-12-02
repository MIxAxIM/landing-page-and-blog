
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";
import BurnContributorState from "./BurnContributorState";

export default function BurnContributorStateDialog({
	treasuryNftPolicyId,
}: {
	treasuryNftPolicyId: string;
}) {
	const [successTxHash, setSuccessTxHash] = useState<string | undefined>(
		undefined,
	);

	if (successTxHash) {
		alert("Success");
	}
	return (
		<Dialog>
			<DialogTrigger className="m-0 p-0">
				<Button size="sm">Leave Project + Earn Credential</Button>
			</DialogTrigger>
			<DialogContent>
				<h3>Leave Course + Receive Credential</h3>
				<p className="prose">
					You can leave this project any time. When you do, you will earn an Andamio credential for the tasks you have completed.
				</p>
				<BurnContributorState
					treasuryNftPolicyId={treasuryNftPolicyId}
					setSuccessTxHash={setSuccessTxHash}
				/>
			</DialogContent>
		</Dialog>
	);
}
