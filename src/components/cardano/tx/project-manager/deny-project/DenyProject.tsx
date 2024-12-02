import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";

export default function DenyProject({
	treasuryNftPolicyId,
	userAccessTokenUnit,
	contributorAlias,
	setSuccessTxHash,
}: {
	treasuryNftPolicyId: string;
	userAccessTokenUnit: string;
	contributorAlias: string;
	setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
	const { wallet } = useWallet();

	const { data: unsignedTxCBOR, error: txError } = api.projectManagerTransactions.denyProject.useQuery({
		userAccessTokenUnit: userAccessTokenUnit,
		contributorAlias: contributorAlias,
		treasuryNftPolicyId: treasuryNftPolicyId,
	})

	if (txError) {
		return (
			<div className="mx-4 flex items-center justify-center rounded-md border px-4 py-3 font-mono text-sm">
				<h2>Transaction Error</h2>
				<p>{txError.message}</p>
			</div>
		);
	}

	return (
		<TransactionContainer
			buttonText={`deny that contribution is complete`}
			unsignedTxCBOR={unsignedTxCBOR}
			wallet={wallet}
			setSuccessTxHash={setSuccessTxHash}
		/>
	);
}
