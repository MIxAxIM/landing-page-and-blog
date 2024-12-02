import { useWallet } from "@meshsdk/react";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import TransactionContainer from "~/components/cardano/common/TransactionContainer";

export default function MintAccessToken({
  userAddress,
  alias,
  setSuccessTxHash,
}: {
  userAddress: string;
  alias: string;
  setSuccessTxHash: Dispatch<SetStateAction<string | undefined>>;
}) {
  const { wallet } = useWallet();

  const { data: unsignedTxCBOR } =
    api.accessTokenTransactions.mintAccessToken.useQuery({
      userAddress: userAddress,
      alias: alias,
    });

  return (
    <TransactionContainer
      buttonText="Mint Andamio Access Token"
      unsignedTxCBOR={unsignedTxCBOR}
      wallet={wallet}
      setSuccessTxHash={setSuccessTxHash}
    />
  );
}
