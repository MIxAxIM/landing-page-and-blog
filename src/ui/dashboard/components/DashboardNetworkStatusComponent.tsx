import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import AccessTokenComponent from "./AccessTokenComponent";
import useGlobalStateDatum from "~/hooks/cardano-indexer-api/network/useGlobalStateDatum";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import useCourses from "~/hooks/db/course/useCourses";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import Loading from "~/components/common/loading";
import useTreasuries from "~/hooks/db/contribution/useTreasuries";
import useValidateCreator from "~/hooks/db/course/useValidateCreator";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import classNames from "~/utils/classnames";
import {
  AggregateUserInfoResponse,
} from "@andamiojs/datum-utils";
import useAggregateUserInfo from "~/hooks/cardano-indexer-api/network/useAggregateUserInfo";
import ContributionManagerComponent from "~/ui/app/roles/contribution-manager/ContributionManagerComponent";

// TODO: How to handle creator course policies?

export default function DashboardNetworkStatusComponent() {

  return <TabsDemo />;
  // return (
  //   <div className="">

  //     {!connected && (
  //       <div className="col-span-4">
  //         <Card>
  //           <p className="my-3 text-lg font-semibold">Welcome to Andamio!</p>
  //           <p className="my-3 text-lg font-semibold">
  //             To get started, connect a wallet (requires Cardano Preprod)
  //           </p>
  //           <CardanoWallet />
  //         </Card>
  //       </div>
  //     )}
  //     {connected && !accessTokenAlias && (
  //       <div className="col-span-4">
  //         <AccessTokenComponent />
  //       </div>
  //     )}

  //     <pre>{JSON.stringify(accessTokenAlias, null, 2)}</pre>
  //     <pre>{JSON.stringify(globalStateDatum, null, 2)}</pre>

  //     <div className="col-span-3">
  //       <Card>
  //         {!!accessTokenAlias &&
  //           !!globalStateDatum &&
  //           globalStateDatum.TokenInfos.length == 0 && (
  //             <div>
  //               <p className="my-3 text-lg font-bold">Start Learning!</p>
  //               <p className="mb-2">
  //                 Explore Andamio course list and try enrolling in one.
  //               </p>
  //               <Link href="/course">
  //                 <Button>View course</Button>
  //               </Link>
  //             </div>
  //           )}
  //         {!!globalStateDatum && globalStateDatum.TokenInfos.length > 0 && (
  //           <div>
  //             <p className="my-3 text-lg font-bold">Keep Learning</p>
  //             <p>
  //               You are enrolled in {globalStateDatum.TokenInfos.length}{" "}
  //               course. Select{" "}
  //               <Link href="/dashboard/learner">
  //                 <span className="hover:text-success">My course</span>
  //               </Link>{" "}
  //               to view course status.
  //             </p>
  //           </div>
  //         )}
  //       </Card>
  //     </div>
  //     {globalStateDatum && (
  //       <div className="col-span-1">
  //         <div className="grid grid-cols-1 gap-y-10">
  //           <DashboardDataComponent
  //             title="course Enrolled"
  //             data={globalStateDatum?.TokenInfos.length.toString() ?? ""}
  //           />
  //           <DashboardDataComponent
  //             title="Access Token Info"
  //             data={globalStateDatum?.UserInfo ?? ""}
  //           />
  //           {/* When Contributor Platform is ready, add a data point here */}
  //           {/* <DashboardDataComponent title="Contributions" data="17" /> */}
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
}
// TODO: Creator Course Policies
//{!!creatorCoursePolicies && creatorCoursePolicies.length > 0 && (
//  <div>
//    <p className="my-3 text-lg font-bold">Build your course(s)</p>
//    <p>
//      You are a Teacher in {creatorCoursePolicies.length} course.
//      Select <span className="font-semibold">Teacher Dashboard</span>{" "}
//      manage course.
//    </p>
//  </div>
//)}
//
//{!!creatorCoursePolicies && creatorCoursePolicies.length > 0 && (
//  <DashboardDataComponent
//    title="course Owned"
//    data={creatorCoursePolicies?.length.toString() ?? ""}
//  />
//)}

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
                  href="/studio"
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

export function Profile() {
  const { data: sessionData } = useSession();
  return (
    <div className="explore-course-bar flex justify-start px-10">
      <div className="category grid grid-cols-2 items-center gap-4">
        <div className="flex max-w-fit justify-center">
          <img
            src={
              sessionData?.user.image ?? `images/site/view-3d-businessman.png`
            }
            alt="Profile"
            className="h-24 w-24 rounded-full object-cover"
          />
        </div>
        <div>
          <h3>{sessionData?.user.name}</h3>
        </div>
      </div>
    </div>
  );
}

export function Overview({
  aggregateUserInfo,
  isLoadingAggregateUserInfo,
}: {
  aggregateUserInfo: AggregateUserInfoResponse | undefined;
  isLoadingAggregateUserInfo: boolean;
}) {
  return (
    <div className="explore-course-bar">
      <div className="category">
        {isLoadingAggregateUserInfo ? (
          <Loading />
        ) : (
          <div className="flex gap-x-40 max-w-full">
            <div>
              <h3>Andamio ID: {aggregateUserInfo?.alias}</h3>
              <h3>Bio: {aggregateUserInfo?.userInfo}</h3>
            </div>
            <div className="flex flex-col gap-y-4">
              <div>
                <h3>
                  course Enrolled: {aggregateUserInfo?.courses.ongoing.length}
                </h3>
                <h3>
                  course Completed:{" "}
                  {aggregateUserInfo?.courses.completed.length}
                </h3>
              </div>
              <div>
                <h3>
                  Projects Joined: {aggregateUserInfo?.projects.ongoing.length}
                </h3>
                <h3>
                  Projects Closed:{" "}
                  {aggregateUserInfo?.projects.completed.length}
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function MyCoursesBar({
  aggregateUserInfo,
}: {
  aggregateUserInfo: AggregateUserInfoResponse | undefined;
}) {
  const { courses, isLoadingCourses } = useCourses();
  const [myCourses, setMyCourses] = useState<any>([]);

  useEffect(() => {
    if (aggregateUserInfo) {
      const myOnchainCourses = aggregateUserInfo.courses.ongoing.map(
        (course) => course.policy,
      );
      if (courses) {
        const myCourses = courses.filter((course) =>
          course.courseNftPolicyId
        );
        setMyCourses(myCourses);
      }
    }
  }, [aggregateUserInfo, isLoadingCourses, courses]);

  return (
    <div className="explore-course-bar">
      <h2 className="mb-4 flex justify-between">
        <div className="text-4xl font-bold">My Courses</div>
        <div></div>
      </h2>
      <div className="category">
        <ScrollArea className="w-full">
          <div className="flex space-x-4 pb-4">
            {(isLoadingCourses || !aggregateUserInfo) && <Loading />}
            {!isLoadingCourses &&
              aggregateUserInfo &&
              courses &&
              myCourses.length === 0 ? (
              <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gray-800 text-white shadow-md">
                <p>You have not enrolled in any courses yet.</p>
                <Link href="/course" passHref>
                  <Button className="ml-4">Explore Courses</Button>
                </Link>
              </div>
            ) : (
              myCourses.length !== 0 &&
              myCourses.map((course: any) => (
                <Link
                  href={`/app/course/${course.courseCode}`}
                  passHref
                  key={course.id}
                  className="item min-w-[180px] transform rounded-lg bg-gray-800 text-white shadow-md transition-transform hover:scale-105 hover:shadow-lg"
                >
                  <img
                    src={
                      course.imageUrl
                        ? course.imageUrl
                        : `images/sample-covers/4.jpg`
                    }
                    alt={course.title}
                    className="h-40 w-full rounded-t-lg object-cover"
                  />
                  <div className="p-2">
                    <p className="font-bold">{course.title}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

export function MyProjectsBar({
  aggregateUserInfo,
}: {
  aggregateUserInfo: AggregateUserInfoResponse | undefined;
}) {
  const { treasuries, isLoadingTreasuries } = useTreasuries();
  const [myProjects, setMyProjects] = useState<any>([]);

  useEffect(() => {
    if (aggregateUserInfo) {
      const myOnchaincourse = aggregateUserInfo.projects.ongoing.map(
        (project) => project.policy,
      );
      if (treasuries) {
        const myProjects = treasuries.filter((treasury) =>
          myOnchaincourse.some(
            (onchainCourse) => onchainCourse === treasury.treasuryNftPolicyId,
          ),
        );
        setMyProjects(myProjects);
      }
    }
  }, [aggregateUserInfo, isLoadingTreasuries, treasuries]);

  return (
    <div className="explore-projects-bar">
      <h2 className="mb-4 flex justify-between">
        <div className="text-4xl font-bold">My Projects</div>
        <div></div>
      </h2>
      <ScrollArea className="w-full">
        <div className="flex space-x-4 pb-4">
          {(isLoadingTreasuries || !aggregateUserInfo) && <Loading />}
          {!isLoadingTreasuries &&
            aggregateUserInfo &&
            treasuries &&
            myProjects.length === 0 ? (
            <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gray-800 text-white shadow-md">
              <p>You have not joined any projects yet.</p>
              <Link href="/projects" passHref>
                <Button className="ml-4">Explore Projects</Button>
              </Link>
            </div>
          ) : (
            treasuries &&
            myProjects.map((treasury: any) => (
              <Link
                href={`/app/project/${treasury.id}`}
                passHref
                key={treasury.id}
                className="item min-w-[180px] transform rounded-lg bg-gray-800 text-white shadow-md transition-transform hover:scale-105 hover:shadow-lg"
              >
                <img
                  src={`images/sample-covers/2.jpg`}
                  alt={treasury.title}
                  className="h-40 w-full rounded-t-lg object-cover"
                />
                <div className="p-2">
                  <p className="font-bold">{treasury.title}</p>
                </div>
              </Link>
            ))
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
