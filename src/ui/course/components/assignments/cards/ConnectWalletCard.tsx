import { CardanoWallet } from "@meshsdk/react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function ConnectWalletCard() {
  return (
    <Card className="border border-primary shadow-md">
      <CardHeader className="flex w-full flex-row items-center justify-between">
        <h2>
          Connect a wallet to commit to this assignment
        </h2>
      </CardHeader>
      <CardContent>
        <CardanoWallet />
      </CardContent>
    </Card>
  );
}
