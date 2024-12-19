
// TODO: How to handle creator course policies?

import { TabsDemo } from "./TabsDemo";

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




