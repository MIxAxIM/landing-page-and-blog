import { signIn, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import AllCourses from "./components/AllCourses";
import MenuBar from "../landing/MenuBar";
import { useWallet, useWalletList } from "@meshsdk/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRoles } from "~/hooks/app/useRoles";

export default function PageCourses() {
  const { data: sessionData } = useSession();
  const wallets = useWalletList();
  const { enableLearner } = useRoles()

  const [walletOption, setWalletOption] = useState<string | undefined>(
    undefined,
  );

  useEffect(() => {
    if (wallets && wallets[0] && wallets[0].name) {
      setWalletOption(wallets[0].name);
    }
  }, [wallets]);

  const { connected, connect } = useWallet();

  useEffect(() => {
    if (sessionData?.user && !sessionData.user.learnerId) {
      void enableLearner();
    }
  }, [sessionData, enableLearner]);

  return (
    <>
      <MenuBar />

      <div className="mx-auto min-h-[50vh] max-w-7xl px-6 sm:my-48 lg:px-8">
        <div className="mx-auto lg:mx-0">
          <h1>
            Andamio Course List
          </h1>
          {/* <FeaturedCourses /> */}
          {!sessionData && (
            <div className="flex basis-1/3 flex-col gap-4">
              <div className="grow">
                <Button
                  onClick={() => {
                    void signIn(undefined, {
                      callbackUrl: `/courses`,
                    });
                  }}
                >
                  Connect to Andamio Platform
                </Button>
              </div>
            </div>
          )}
          <div className="mb-5 flex flex-col items-center justify-between md:flex-row">
            <div className="mt-6 text-lg leading-8 text-gray-600">
              {sessionData
                ? `Connected to Andamio Platform as ${sessionData.user.name}`
                : "You are not logged in. Browse courses for free. When you are ready, connect to the Andamio Network."}
            </div>
            <div className="mt-6 text-lg leading-8 text-gray-600">
              {!connected && wallets && !!wallets[0]?.name ? (
                <div className="flex basis-1/3 flex-col gap-4">
                  <div className="grow">
                    {walletOption && (
                      <Button onClick={() => connect(walletOption)}>
                        Connect {walletOption} Wallet to Andamio Network
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {!!wallets && !!wallets[0]?.name ? (
                    "Connected to Andamio Network"
                  ) : (
                    <p>
                      To connect to the Andamio Network, please install a
                      Cardano Wallet like{" "}
                      <Link
                        href="https://www.namiwallet.io/"
                        className="font-semibold text-primary"
                      >
                        Nami
                      </Link>{" "}
                      or{" "}
                      <Link
                        href="https://eternl.io/"
                        className="font-semibold text-primary"
                      >
                        Eternl
                      </Link>
                      .
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <AllCourses />
      </div>
    </>
  );
}
