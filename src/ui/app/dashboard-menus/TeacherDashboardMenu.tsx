import Link from "next/link";
import { useRouter } from "next/router";
import { useAccessToken } from "~/hooks/cardano-indexer-api/useAccessToken";
//import useCreatorsCoursesPolicies from "~/hooks/cardano-indexer-api/useCreatorsCoursesPolicies";
import { CardanoWallet } from "@meshsdk/react";
import AndamioNetworkTeacherCourses from "~/ui/app/roles/teacher/AndamioNetworkTeacherCourses";


// TODO: Implement 2024-12-03

export default function TeacherDashboardMenu() {
  const { accessTokenAlias } = useAccessToken();
  const router = useRouter();

  //const { creatorCoursePolicies } = useCreatorsCoursesPolicies(
  //  accessTokenAlias ?? "",
  //);

  const isAssignmentRoute = router.asPath.includes(
    "dashboard/teacher/assignments",
  );

  // const isDashboardRoute = router.asPath.includes("dashboard/teacher");

  return (
    <div className="grid min-h-28 w-full grid-cols-6 items-center gap-5 bg-primary text-primary-foreground">
      <div className="col-start-1 text-center">
        <Link href="/dashboard/teacher">
          <div className={`cursor-pointer p-2 font-semibold`}>
            Teacher Dashboard Home
          </div>
        </Link>
      </div>
      <div className="col-span-2 col-start-2">
      </div>
      <div className="col-span-2 col-start-4 text-center">
        <Link href="/studio">View Course Studio</Link>
      </div>
      <div className="col-start-6 text-center">
        <Link href="/dashboard/teacher/assignments">
          <div
            className={`cursor-pointer p-2 font-semibold ${isAssignmentRoute ? "bg-accent" : "bg-primary text-primary-foreground"}`}
          >
            Review Assignments
          </div>
        </Link>
      </div>
    </div>
  );
}



//{creatorCoursePolicies ? (
//  <AndamioNetworkTeacherCourses
//    creatorCoursePolicies={creatorCoursePolicies}
//  />
//) : (
//  <CardanoWallet />
//)}
