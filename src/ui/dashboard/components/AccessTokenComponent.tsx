import Link from "next/link";
import { useState } from "react";

import { Card } from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";

import { BookOpenText, GlobeLockIcon } from "lucide-react";
import MintAccessTokenDialog from "~/components/transactions/dialogs/MintAccessTokenDialog";

export default function AccessTokenComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card intent="dashboard" size="dashboard">
      <h2>Connect to the Andamio Network</h2>
      <p className="mx-auto mb-3 w-5/6 text-left text-lg">
        You are now connected to the Andamio Platform with Discord. To access
        the Andamio Network, you can also connect a Cardano wallet and mint an
        Andamio Network Token.
      </p>
      <p className="mx-auto mb-3 w-5/6 text-left text-lg">
        Each time you connect a wallet, this page will suggest next steps based
        on the Andamio Network Token you hold.
      </p>
      <div className="grid grid-cols-1 gap-3">
        <Link href="/course/andamio101/102/lesson/2">
          <div className="flex w-full flex-row items-center gap-8 rounded-md border border-foreground bg-primary px-8 py-2 text-primary-foreground">
            <BookOpenText width={35} height={35} className="" />
            <p>Learn About Andamio Network</p>
          </div>
        </Link>
        <div>
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="">
            <CollapsibleTrigger asChild>
              <div className="flex w-full cursor-pointer flex-row items-center gap-8 rounded-md border border-foreground bg-primary px-8 py-2 text-primary-foreground">
                <GlobeLockIcon width={35} height={35} className="" />
                <p>
                  {isOpen ? (
                    <>Cancel Minting</>
                  ) : (
                    <>Get Andamio Network Token</>
                  )}
                </p>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent className="flex items-center justify-center space-y-2 py-3">
              <MintAccessTokenDialog />
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </Card>
  );
}
