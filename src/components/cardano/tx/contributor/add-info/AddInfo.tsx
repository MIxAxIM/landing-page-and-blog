
import { api } from "~/utils/api";
import { type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { useAccessToken } from "~/hooks/cardano-indexer-api/useAccessToken";
import { useWallet } from "@meshsdk/react";

export default function AddInfo({
	treasuryNftPolicyId,
	info,
	setSuccessTxHash,
}: {
	treasuryNftPolicyId: string;
	info?: string;
	setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
	const { accessTokenAsset } = useAccessToken();
	const { wallet } = useWallet();


	const {
		data: unsignedTxCBOR,
		isLoading,
		error: txError,
	} = api.contributorTransactions.addInfo.useQuery(
		{
			treasuryNftPolicyId: treasuryNftPolicyId,
			info: info ?? "",
			userAccessTokenUnit: accessTokenAsset?.unit ?? "",
		},
		{
			// Don't attempt the query if we don't have an alias
			enabled: !!treasuryNftPolicyId && !!accessTokenAsset,
			// Don't retry on error since we expect some queries to fail
			retry: false,
		},
	);

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
			buttonText={`Add Contribution Evidence`}
			unsignedTxCBOR={unsignedTxCBOR}
			wallet={wallet}
			setSuccessTxHash={setSuccessTxHash}
		/>
	);
}
