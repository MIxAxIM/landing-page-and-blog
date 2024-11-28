import { useAccessToken } from "~/hooks/onchain/useAccessToken";
import DashboardDataComponent from "./DashboardDataComponent";
import AccessTokenComponent from "./AccessTokenComponent";
import useGlobalStateDatum from "~/hooks/onchain/useGlobalStateDatum";
import { CardanoWallet, useWallet } from "@meshsdk/react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Lock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import useCourses from "~/hooks/course/useCourses";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import Loading from "~/components/loading";
import useTreasuries from "~/hooks/contribution/useTreasuries";
import useValidateCreator from "~/hooks/course/useValidateCreator";
import { useSession } from "next-auth/react";
import { use, useCallback, useEffect, useState } from "react";
import { api } from "~/utils/api";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import classNames from "~/utils/classnames";

// TODO: How to handle creator course policies?

export default function DashboardNetworkStatusComponent() {
  const { connected } = useWallet();
  const { accessTokenAlias } = useAccessToken();
  const { globalStateDatum } = useGlobalStateDatum(accessTokenAlias ?? "");

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
  //               <Link href="/courses">
  //                 <Button>View Courses</Button>
  //               </Link>
  //             </div>
  //           )}
  //         {!!globalStateDatum && globalStateDatum.TokenInfos.length > 0 && (
  //           <div>
  //             <p className="my-3 text-lg font-bold">Keep Learning</p>
  //             <p>
  //               You are enrolled in {globalStateDatum.TokenInfos.length}{" "}
  //               courses. Select{" "}
  //               <Link href="/dashboard/learner">
  //                 <span className="hover:text-success">My Courses</span>
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
  //             title="Courses Enrolled"
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
//      You are a Teacher in {creatorCoursePolicies.length} courses.
//      Select <span className="font-semibold">Teacher Dashboard</span>{" "}
//      manage courses.
//    </p>
//  </div>
//)}
//
//{!!creatorCoursePolicies && creatorCoursePolicies.length > 0 && (
//  <DashboardDataComponent
//    title="Courses Owned"
//    data={creatorCoursePolicies?.length.toString() ?? ""}
//  />
//)}

export function TabsDemo() {
  const [showOverlay, setShowOverlay] = useState(true);
  const { connected } = useWallet();

  useEffect(() => {
    if (connected) {
      setShowOverlay(false);
    }
  }, [connected]);

  const { data: sessionData } = useSession();
  const { isCreator } = useValidateCreator(sessionData);

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
          <TabsContent value="dashboard" className="relative space-y-4">
            {showOverlay && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-start justify-center z-10 rounded-lg pt-4">
                <CardanoWallet />
              </div>
            )}
            <Card>
              <CardContent className="space-y-4">
                <Overview />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-4">
                <MyCoursesBar />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-4">
                <MyProjectsBar />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="workspace" className="space-y-4">
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

export function Overview() {
  const { accessTokenAlias } = useAccessToken();
  const { globalStateDatum, isLoadingGlobalStateDatum } = useGlobalStateDatum(
    accessTokenAlias ?? "",
  );
  const completedCourses = globalStateDatum?.TokenInfos.filter(
    (tokenInfo: { Minted: boolean }) => !tokenInfo.Minted,
  ).length;
  const enrolledCourses = globalStateDatum?.TokenInfos.filter(
    (tokenInfo: { Minted: boolean }) => tokenInfo.Minted,
  ).length;
  return (
    <div className="explore-courses-bar">
      <h2 className="mb-4 flex justify-between">
        <div className="text-4xl font-bold">Overview</div>
      </h2>
      <div className="category">
        {isLoadingGlobalStateDatum && <Loading />}
        <h3>Andamio ID: {globalStateDatum?.UserName}</h3>
        <h3>Bio: {globalStateDatum?.UserInfo}</h3>
        <h3>Courses Completed: {completedCourses}</h3>
        <h3>Courses Enrolled: {enrolledCourses}</h3>
      </div>
    </div>
  );
}

export function MyCoursesBar() {
  const { courses, isLoadingCourses } = useCourses();
  return (
    <div className="explore-courses-bar">
      <h2 className="mb-4 flex justify-between">
        <div className="text-4xl font-bold">My Courses</div>
        <div></div>
      </h2>
      <div className="category">
        <ScrollArea className="w-full">
          <div className="flex space-x-4 pb-4">
            {isLoadingCourses && <Loading />}
            {courses &&
              courses.map((course) => (
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
              ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

export function MyProjectsBar() {
  const { treasuries, isLoadingTreasuries } = useTreasuries();
  return (
    <div className="explore-projects-bar">
      <h2 className="mb-4 flex justify-between">
        <div className="text-4xl font-bold">My Projects</div>
        <div></div>
      </h2>
      <ScrollArea className="w-full">
        <div className="flex space-x-4 pb-4">
          {isLoadingTreasuries && <Loading />}
          {treasuries &&
            treasuries.map((treasury) => (
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
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
