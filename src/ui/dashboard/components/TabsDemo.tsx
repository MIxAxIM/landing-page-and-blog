import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import AccessTokenComponent from "./AccessTokenComponent";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import useValidateCreator from "~/hooks/db/course/useValidateCreator";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import classNames from "~/utils/classnames";
import useAggregateUserInfo from "~/hooks/cardano-indexer-api/network/useAggregateUserInfo";
import { MyCoursesBar } from "./MyCoursesBar";
import { MyProjectsBar } from "./MyProjectsBar";
import { Profile } from "./Profile";
import { Overview } from "./Overview";
import ContributionManagerComponent from "~/ui/studio/project/ContributionManagerComponent";

export function TabsDemo() {
  const [showOverlay, setShowOverlay] = useState(true);
  const { connected } = useWallet();
  const [hasAccessToken, setHasAccessToken] = useState(false);

  const { data: sessionData } = useSession();
  const { isCreator } = useValidateCreator(sessionData);

  const { accessTokenAlias } = useAccessToken();

  const { aggregateUserInfo, isLoadingAggregateUserInfo } = useAggregateUserInfo()

  useEffect(() => {
    if (connected) {
      if (accessTokenAlias) {
        setHasAccessToken(true);
        setShowOverlay(false);
      }
    } else {
      setHasAccessToken(false);
      setShowOverlay(true);
    }
  }, [connected, accessTokenAlias]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">My Dashboard</TabsTrigger>
          <TabsTrigger
            value="workspace"
            disabled={!isCreator}
            className={!isCreator ? "cursor-not-allowed opacity-50" : undefined}
          >
            My Workspace
            {!isCreator ? <Lock className="ml-2 h-4 w-4" /> : null}
          </TabsTrigger>
        </TabsList>
        <div className="mt-6">
          <TabsContent value="dashboard" className="space-y-4">
            <div>
              <Card>
                <div className="flex items-center justify-center text-4xl font-bold">
                  Profile
                </div>
              </Card>
            </div>
            <div>
              <Card>
                <Profile />
              </Card>
            </div>
            <div>
              <Card>
                <div className="flex items-center justify-center text-4xl font-bold">
                  Network Status
                </div>
              </Card>
            </div>
            <div className="relative space-y-4">
              {showOverlay && (
                <div className="absolute inset-0 z-10 flex items-start justify-center rounded-lg bg-background/80 pt-4 backdrop-blur-sm">
                  {!connected && <CardanoWallet />}
                  {connected && !hasAccessToken && <AccessTokenComponent />}
                </div>
              )}
              <Card>
                <CardContent className="space-y-4">
                  <Overview
                    aggregateUserInfo={aggregateUserInfo}
                    isLoadingAggregateUserInfo={isLoadingAggregateUserInfo}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-4">
                  <MyCoursesBar aggregateUserInfo={aggregateUserInfo} />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="space-y-4">
                  <MyProjectsBar aggregateUserInfo={aggregateUserInfo} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="workspace" className="w-11/12 mx-auto my-24 space-y-4">
            <ContributionManagerComponent />
            <Card>
              <CardContent className="space-y-4">
                <Link
                  href="/studio/course"
                  className={classNames("flex flex-row items-center gap-x-3")}
                >
                  <PencilSquareIcon
                    className={classNames("h-6 w-6 shrink-0")}
                    aria-hidden="true"
                  />
                  Course Studio
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-4">
                <Link
                  href="/app/prequisite-minter"
                  className={classNames("flex flex-row items-center gap-x-3")}
                >
                  <PencilSquareIcon
                    className={classNames("h-6 w-6 shrink-0")}
                    aria-hidden="true"
                  />
                  Prerequisite Studio
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
