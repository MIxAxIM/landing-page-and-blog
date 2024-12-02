import { type TxManagerState } from "@maestro-org/typescript-sdk";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { maestro_key } from "~/config/maestro";

export default function useUnconfirmedTx(unconfirmedTxHash: string) {
  //   const { data: sessionData } = useSession();

  //   console.log(sessionData);

  //   if (!sessionData?.user?.unconfirmedTx) {
  //     throw new Error("No unconfirmed transaction found in session data");
  //   }

  const txHash = unconfirmedTxHash;

  const fetchTxState = async (txHash: string) => {
    const response: { data: TxManagerState } = await axios.get(
      `https://preprod.gomaestro-api.org/v1/txmanager/${txHash}/state`,
      {
        maxBodyLength: Infinity,
        headers: {
          Accept: "text/plain",
          "api-key": maestro_key,
        },
      },
    );
    return response.data;
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["transactionState", txHash],
    queryFn: () => fetchTxState(txHash),
    enabled: !!txHash,
  });

  return { data, isError, isLoading };
}
