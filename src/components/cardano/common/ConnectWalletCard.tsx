import { CardanoWallet } from "@meshsdk/react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function ConnectWalletCard({ message }: { message: string }) {
  return (
    <Card className="">
      <CardHeader className="flex mx-auto flex-row items-center justify-between">
        <h2>
          {message}
        </h2>
      </CardHeader>
      <CardContent>
        <CardanoWallet />
      </CardContent>
    </Card>
  );
}
