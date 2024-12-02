
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";
import UnlockProject from "./UnlockProject";

export default function UnlockProjectDialog({
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
				<Button size="sm">Unlock Project</Button>
			</DialogTrigger>
			<DialogContent>
				<h3>Unlock Project</h3>
				<p className="prose">
					If you will not complete this task, you can unlock your commitment.
				</p>
				<UnlockProject
					treasuryNftPolicyId={treasuryNftPolicyId}
					setSuccessTxHash={setSuccessTxHash}
				/>
			</DialogContent>
		</Dialog>
	);
}
