import { api } from "~/utils/api";
import { type Dispatch, type SetStateAction } from "react";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import { useWallet } from "@meshsdk/react";

export default function BurnContributorState({
	treasuryNftPolicyId,
	setSuccessTxHash,
}: {
	treasuryNftPolicyId: string;
	setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
	const { accessTokenAsset } = useAccessToken();
	const { wallet } = useWallet();

	const {
		data: unsignedTxCBOR,
		error: txError,
	} = api.contributorTransactions.burnContributorState.useQuery(
		{
			treasuryNftPolicyId: treasuryNftPolicyId ?? "",
			userAccessTokenUnit: accessTokenAsset?.unit ?? "",
		},
		{
			// Don't attempt the query if we don't have an alias
			enabled: !!treasuryNftPolicyId && !!accessTokenAsset
		},
	);

	if (txError) {
		return (
			<div className="mx-4 flex items-center justify-center rounded-md border px-4 py-3 font-mono text-sm">
				<h2>Transaction Error</h2>
				<p>{JSON.stringify(txError.message)}</p>
			</div>
		);
	}

	return (
		<div>
			<TransactionContainer
				buttonText={`Burn Contributor State and Leave Project`}
				unsignedTxCBOR={unsignedTxCBOR}
				wallet={wallet}
				setSuccessTxHash={setSuccessTxHash}
			/>
		</div>
	);
}
