import { CardanoWallet } from "@meshsdk/react";
import MenuBar from "../../ui/landing/MenuBar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Link from "next/link";

export default function Teamspace() {
  return (
    <div>
      <MenuBar />

      <main className="px-10 pt-24">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          TEAMSPACE
        </h1>
        <div className="flex max-w-full flex-col items-center justify-center">
          <Card className="my-20 w-2/3">
            <CardHeader>
              <CardTitle>Connect Wallet</CardTitle>
              <CardDescription>
                Connect wallet for Andamio to find assets belonging to your
                organizations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CardanoWallet />
            </CardContent>
          </Card>
          <Link href="/teamspace/andamio" className="flex h-full w-2/3">
            <Card className="flex h-full w-full items-center justify-center border-black bg-white hover:border-2">
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Andamio Team
              </h2>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
