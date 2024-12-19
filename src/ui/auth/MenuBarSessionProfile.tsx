import { signOut, useSession } from "next-auth/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { useRouter } from "next/router";

export default function MenuBarSessionProfile() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { connected, disconnect } = useWallet();

  if (!sessionData) {
    return null;
  }

  return (
    <Popover>
      <div className="mt-1 flex items-center justify-center px-5">
        <HoverCard>
          <HoverCardTrigger>
            {connected ? (
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
            ) : (
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
            )}
          </HoverCardTrigger>
          <HoverCardContent>
            {connected ? (
              <p>You are connected to cardano</p>
            ) : (
              <p>You have not connected to cardano</p>
            )}
          </HoverCardContent>
        </HoverCard>
      </div>
      <PopoverTrigger className="flex items-center gap-x-4 text-sm font-semibold leading-6 text-foreground">
        <span className="sr-only">Your profile</span>
        <span aria-hidden="true">{sessionData.user?.name}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="h-8 w-8 rounded-full bg-accent"
          src={sessionData.user?.image ?? ""}
          alt=""
        />
      </PopoverTrigger>
      <PopoverContent className="bg-white p-0">
        {!connected ? (
          <Dialog>
            <DialogTrigger className="block w-full px-6 py-3 text-left text-sm font-semibold leading-6 text-foreground hover:bg-accent focus:outline-none">
              Connect to Cardano
            </DialogTrigger>
            <DialogContent className="bg-slate-400">
              <DialogHeader>
                <DialogTitle>Connect your Cardano wallet</DialogTitle>
                <DialogDescription>
                  Experience Andamio to the fullest by connecting your Cardano
                  wallet.
                </DialogDescription>
              </DialogHeader>
              <CardanoWallet />
            </DialogContent>
          </Dialog>
        ) : (
          <button
            onClick={disconnect}
            className="block w-full px-6 py-3 text-left text-sm font-semibold leading-6 text-foreground hover:bg-accent focus:outline-none"
          >
            Disconnect Cardano
          </button>
        )}

        <button
          onClick={() => void router.push("/dashboard")}
          className="block w-full px-6 py-3 text-left text-sm font-semibold leading-6 text-foreground hover:bg-accent focus:outline-none"
        >
          Dashboard
        </button>

        {!!sessionData.user.creatorId && (
          <button
            onClick={() => void router.push("/studio")}
            className="block w-full px-6 py-3 text-left text-sm font-semibold leading-6 text-foreground hover:bg-accent focus:outline-none"
          >
            Andamio Studio
          </button>
        )}

        <button
          onClick={() => void signOut({ callbackUrl: "/" })}
          className="block w-full px-6 py-3 text-left text-sm font-semibold leading-6 text-foreground hover:bg-accent focus:outline-none"
        >
          Sign Out
        </button>
      </PopoverContent>
    </Popover>
  );
}
