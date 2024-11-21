import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/utils/api";

const Commit: React.FC = () => {
  const router = useRouter();
  const { policy } = router.query;

  const [accessToken, setAccessToken] = React.useState("");
  const [adaAmount, setAdaAmount] = React.useState("");
  const [txCbor, setTxCbor] = React.useState(undefined);

  const addFundsMutation = api.projectGeneral.addFunds.useMutation();

  const onclick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const data = await addFundsMutation.mutateAsync({
        policy: policy as string,
        dipositorsAddress: accessToken,
        adaAmount,
      });
      setTxCbor(data.txCbor);
    } catch (error) {
      console.error("Error adding funds:", error);
    }
  };

  return (
    <>
      <div>
        <label>
          User&quot;s Access Token:
          <input
            type="text"
            name="accessToken"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
          />
        </label>
        <label>
          Project Content:
          <input
            type="text"
            name="adaAmount"
            value={adaAmount}
            onChange={(e) => setAdaAmount(e.target.value)}
          />
        </label>
        <label>
          Expiration Time:
          <input
            type="text"
            name="adaAmount"
            value={adaAmount}
            onChange={(e) => setAdaAmount(e.target.value)}
          />
        </label>
        <label>
          ADA:
          <input
            type="text"
            name="adaAmount"
            value={adaAmount}
            onChange={(e) => setAdaAmount(e.target.value)}
          />
        </label>
        <Button onClick={onclick} disabled={addFundsMutation.isLoading}>
          {addFundsMutation.isLoading ? "Processing..." : "Commit"}
        </Button>
      </div>
      <div>
        <br />
        {txCbor && <pre>{JSON.stringify(txCbor, null, 2)}</pre>}
      </div>
    </>
  );
};

export default Commit;
