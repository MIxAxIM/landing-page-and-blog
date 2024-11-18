import axios from "axios";
import { useRouter } from "next/router";
import React from "react";
import { Button } from "~/components/ui/button";
import { env } from "~/env";
import { api } from "~/utils/api";

const AddFunds: React.FC = () => {
  const router = useRouter();
  const { policy } = router.query;

  const [dipositorsAddress, setDipositorsAddress] = React.useState("");
  const [adaAmount, setAdaAmount] = React.useState("");

  const [txCbor, setTxCbor] = React.useState(undefined);

  const onclick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const res = await axios.get(`${env.API_URL}/tx/treasury/add-funds`, {
      params: {
        policy: policy as string,
        user_address: dipositorsAddress,
        amount: adaAmount,
      },
    });

    setTxCbor(res.data);
  };
  return (
    <>
      <div>
        <label>
          Depositor's Address:
          <input
            type="text"
            name="dipositorsAddress"
            value={dipositorsAddress}
            onChange={(e) => setDipositorsAddress(e.target.value)}
          />
        </label>
        <label>
          ADA Amount:
          <input
            type="text"
            name="adaAmount"
            value={adaAmount}
            onChange={(e) => setAdaAmount(e.target.value)}
          />
        </label>
        <Button onClick={onclick}>Add Funds</Button>
      </div>
      <div>
        <br />
        {txCbor && <pre>{JSON.stringify(txCbor, null, 2)}</pre>}
      </div>
    </>
  );
};

export default AddFunds;
