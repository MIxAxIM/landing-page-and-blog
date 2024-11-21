import { CardanoWallet } from "@meshsdk/react";
import { Card } from "~/components/ui/card";
import AccessTokenComponent from "~/ui/dashboard/components/AccessTokenComponent";

export default function MintAccessToken() {

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
