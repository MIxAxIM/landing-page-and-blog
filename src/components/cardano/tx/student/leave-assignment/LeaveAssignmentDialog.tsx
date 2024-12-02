import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useState } from "react";
import LeaveAssignment from "./LeaveAssignment";

export default function LeaveAssignmentDialog({
	courseNftPolicyId,
}: {
	courseNftPolicyId: string;
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
				<Button size="sm">Leave Assignment</Button>
			</DialogTrigger>
			<DialogContent>
				<h3>Unlock Project</h3>
				<p className="prose">
					If you will not complete this assignment, you can unlock your commitment.
				</p>
				<LeaveAssignment
					courseNftPolicyId={courseNftPolicyId}
					setSuccessTxHash={setSuccessTxHash}
				/>
			</DialogContent>
		</Dialog>
	);
}
