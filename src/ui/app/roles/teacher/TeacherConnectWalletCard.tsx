import { CardanoWallet } from "@meshsdk/react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export default function TeacherConnectWalletCard() {
  return (
    <Card className="">
      <CardHeader className="flex w-full flex-row items-center justify-between">
        <h2 className="text-xl font-bold">
          Connect a Wallet to Manage Your Courses
        </h2>
      </CardHeader>
      <CardContent>
        <CardanoWallet />
      </CardContent>
    </Card>
  );
}
