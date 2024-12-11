import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import TransactionCostDetails, { CostBreakdown } from "~/components/cardano/common/TransactionCostDetails";
import { useSession } from "next-auth/react";

// TODO: Add polling

export default function MintAccessToken({
  userAddress,
  alias,
  successTxHash,
  setSuccessTxHash,
}: {
  userAddress: string;
  alias: string;
  successTxHash: string | undefined;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { wallet } = useWallet();
  const { updateHasMintedAccessToken } = useAccessToken()
  const { data: sessionData } = useSession();


  const costBreakdown: CostBreakdown = {
    costDescriptions: [
      { txInputIndexes: [1], txOutputIndexes: [0, 1], description: "Unique name reservation", tooltipText: "Tooltip info" },
      { txOutputIndexes: [2], description: "Andamio Network Fee", tooltipText: "Fee paid to Andamio Network" },
      { txOutputIndexes: [3], description: "Andamio Reference Credential", tooltipText: "This Ada is required to initialize your Andamio Network Token" },
    ],
    andamioNetworkFee: 0, // How to incorporate network fee -> Dev team 2024-12-09
  }

  const { data: unsignedTxCBOR } =
    api.accessTokenTransactions.mintAccessToken.useQuery({
      userAddress: userAddress,
      alias: alias,
    });

  // Make sure that this runs => params??
  const handleStatusChange = async (txHash: string) => {
    if (!sessionData?.user?.id) return;
    updateHasMintedAccessToken({
      userId: sessionData?.user?.id,
      hasMinted: true,
      txHash: txHash,
    });
  };

  return (
    <div className="flex flex-col w-full mx-auto">
      {!!unsignedTxCBOR && (
        <TransactionCostDetails unsignedTxCBOR={unsignedTxCBOR.unsignedTxCBOR} costBreakdown={costBreakdown} />
      )}
      <TransactionContainer
        buttonText="Mint Andamio Access Token"
        unsignedTxCBOR={unsignedTxCBOR}
        wallet={wallet}
        setSuccessTxHash={setSuccessTxHash}
        onTransactionSuccess={handleStatusChange}
      />
    </div >
  );
}
