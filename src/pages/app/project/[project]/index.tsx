import { DecodedGlobalStateDatum } from "@andamiojs/datum-utils";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { BadgeCheck, BadgeX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MintProjectStateDialog from "~/components/cardano/tx/contributor/mint-project-state/MintProjectStateDialog";
import Loading from "~/components/common/loading";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import useAggregateUserInfo from "~/hooks/cardano-indexer-api/network/useAggregateUserInfo";
import useGlobalStateDatum from "~/hooks/cardano-indexer-api/network/useGlobalStateDatum";
import useProjectByTreasury from "~/hooks/cardano-indexer-api/project/useProjects";
import useTreasuries from "~/hooks/db/contribution/useTreasuries";
import { useTreasury } from "~/hooks/db/contribution/useTreasury";
import AccessTokenComponent from "~/ui/dashboard/components/AccessTokenComponent";
import MenuBar from "~/ui/landing/MenuBar";

export default function ProjectPage() {
  const router = useRouter();
  const { project } = router.query;
  const { connected } = useWallet();
  const { accessTokenAlias } = useAccessToken();

  const { treasury, isLoading } = useTreasury(project as string);
  const { treasuryInfo, isLoadingTreasuryInfo } = useProjectByTreasury({
    treasuryNftPolicyId: treasury?.treasuryNftPolicyId ?? "",
  });

  const { aggregateUserInfo, isLoadingAggregateUserInfo } =
    useAggregateUserInfo(accessTokenAlias ?? "");

  const [currentProject, setCurrentProject] = useState<string | undefined>(undefined);
  const [hasLocalState, setHasLocalState] = useState<boolean>(false);
  const [commitment, setCommitment] = useState<
    | {
      project_content: string;
      status: "PENDING_APPROVAL" | "IN_COMMITMENT";
      submitted_info?: string;
    }
    | undefined
  >(undefined);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  useEffect(() => {

    if (project) {
      setCurrentProject(project as string);
    }
  }, [project])

  useEffect(() => {
    if (aggregateUserInfo && treasury && treasury.treasuryNftPolicyId) {
      // Also check if boolean is true
      setHasLocalState(
        aggregateUserInfo?.projects.ongoing.some((info) => {
          if (info.policy === treasury.treasuryNftPolicyId) {
            setCommitment(info.commitment);
            return true;
          }
        }),
      );
    }
  }, [
    accessTokenAlias,
    aggregateUserInfo,
    isLoadingAggregateUserInfo,
    treasury,
    isLoading,
  ]);

  if (isLoading) return <Loading />;
  return (
    <DesktopOnlyLayout>
      <MenuBar />
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col items-center space-y-4 md:flex-row md:space-x-8 md:space-y-0">
          <img
            src="https://andamio.io/andamio.png"
            className="h-40 rounded-t-lg object-cover"
          />
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold">{treasury?.title}</h1>
            <p className="text-gray-600">
              Policy: {treasury?.treasuryNftPolicyId}
            </p>
            {/* <p className="text-gray-600">
              Maybe a short description of the project here.
            </p> */}
          </div>
        </div>
        {!connected ? (
          <div className="flex max-w-full justify-center">
            <CardanoWallet />
          </div>
        ) : (
          <>
            {hasLocalState ? (
              <>
                <div className="flex justify-between gap-x-40">
                  <div className="mt-8">
                    <h2 className="mb-4 text-2xl font-bold">My Commitment</h2>

                    {!commitment ? (
                      <div className="flex items-center justify-center rounded-lg bg-gray-200 p-4 text-gray-600">
                        "No commitment found."
                      </div>
                    ) : (
                      <Link
                        href={`/app/project/${currentProject}/${commitment.project_content}`}
                        passHref
                        key={project as string}
                        className="transform flex items-center justify-center rounded-lg bg-gray-200 p-4 text-gray-600 shadow-md transition-transform hover:scale-105 hover:shadow-lg"
                      >
                        <h6 className="text-xl font-bold">
                          {commitment.project_content}
                        </h6>
                      </Link>
                    )}

                  </div>

                  <div className="mt-8">
                    <h2 className="mb-4 text-2xl font-bold">Status</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {!commitment ? null : (
                        <>
                          <h3 className="text-xl font-bold">
                            {commitment.status}
                          </h3>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="mb-4 text-2xl font-bold">Completed Tasks</h2>
                  {/* Datum of contributor state */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Placeholder for completed tasks */}
                    <div className="flex items-center justify-center rounded-lg bg-gray-200 p-4 text-gray-600">
                      No completed tasks yet.
                    </div>
                    <div className="flex items-center justify-center rounded-lg bg-gray-200 p-4 text-gray-600">
                      No completed tasks yet.
                    </div>
                    <div className="flex items-center justify-center rounded-lg bg-gray-200 p-4 text-gray-600">
                      No completed tasks yet.
                    </div>
                    <div className="flex items-center justify-center rounded-lg bg-gray-200 p-4 text-gray-600">
                      No completed tasks yet.
                    </div>
                    <div className="flex items-center justify-center rounded-lg bg-gray-200 p-4 text-gray-600">
                      No completed tasks yet.
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="mb-4 text-2xl font-bold">Explore Tasks</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {treasuryInfo && treasuryInfo.projects.length > 0 ? (
                      treasuryInfo.projects.map((project) => (
                        <div
                          key={project.project_hash}
                          className="rounded-lg bg-white p-4 shadow-md"
                        >
                          <h6 className="truncate text-xl font-bold">
                            {project.project_hash}
                          </h6>
                          <p className="truncate text-gray-600">
                            {project.commitment_allowed}
                          </p>
                          <Link
                            href={`/app/project/${project.project_hash}`}
                            passHref
                          >
                            <Button className="mt-4">View Project</Button>
                          </Link>
                        </div>
                      ))
                    ) : isLoadingTreasuryInfo ? (
                      <Loading />
                    ) : (
                      <div className="flex items-center justify-center rounded-lg bg-gray-200 p-4 text-gray-600">
                        No project tasks yet.
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : accessTokenAlias && isLoadingAggregateUserInfo ? (
              <Loading />
            ) : (
              // /* CTA Section */
              <div className="mt-8 flex justify-start text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600">
                      Join Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <div className="grid gap-4 py-4">
                      <div className="flex gap-x-4">
                        {connected ? <BadgeCheck /> : <BadgeX />}
                        Connected to Cardano
                        {!connected && <CardanoWallet />}
                      </div>
                      <div className="flex gap-x-4">
                        {accessTokenAlias ? <BadgeCheck /> : <BadgeX />}
                        Connected to Andamio Network
                        {connected && !accessTokenAlias && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button>Join Andamio Network</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <AccessTokenComponent />
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            type="submit"
                            disabled={!connected || !accessTokenAlias}
                          >
                            Proceed To Join
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          {/* TO-DO */}
                          <MintProjectStateDialog />
                        </DialogContent>
                      </Dialog>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </>
        )}
      </div>
    </DesktopOnlyLayout>
  );
}
