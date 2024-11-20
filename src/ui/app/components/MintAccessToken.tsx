import { CardanoWallet, useWallet } from "@meshsdk/react";
import { Card } from "~/components/ui/card";
import { useAccessToken } from "~/hooks/onchain/useAccessToken";
import AccessTokenComponent from "~/ui/dashboard/components/AccessTokenComponent";

export default function MintAccessToken() {

  const { connected } = useWallet();
  const { accessTokenAlias } = useAccessToken();
  return (
    <div className="mx-auto my-24 w-2/3 space-y-5">
      <div className="col-span-4">
        <Card>
          <p className="my-3 text-lg font-semibold">Welcome to Andamio!</p>
          <p className="my-3 text-lg font-semibold">
            To get started, connect a wallet (requires Cardano Preprod)
          </p>
          <CardanoWallet />
        </Card>
        <AccessTokenComponent />
      </div>
    </div>
  )
}
