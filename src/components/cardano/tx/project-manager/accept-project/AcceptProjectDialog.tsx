import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";
import AcceptProject from "./AcceptProject";

// TODO: get contributor info from query, to pass to this dialog?

export default function AcceptProjectDialog({
	taskCommitmentId,
	treasuryNftPolicyId,
	userAccessTokenUnit,
	contributorAlias,
}: {
	taskCommitmentId: string;
	treasuryNftPolicyId: string;
	userAccessTokenUnit: string;
	contributorAlias: string
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
				<Button size="sm">Accept Project Commitment</Button>
			</DialogTrigger>
			<DialogContent className="max-w-7xl">
				<div className="grid grid-cols-2 gap-8">
					<div className="p-2">
						<h3>Unlock Project</h3>
						<p className="prose">
							Accept this project commitment.
						</p>
					</div>
					<div className="p-2">
						<AcceptProject
							taskCommitmentId={taskCommitmentId}
							treasuryNftPolicyId={treasuryNftPolicyId}
							userAccessTokenUnit={userAccessTokenUnit}
							contributorAlias={contributorAlias}
							setSuccessTxHash={setSuccessTxHash}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}


