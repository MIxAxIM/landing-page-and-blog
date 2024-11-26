import { CardanoWallet, useWallet } from "@meshsdk/react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useLearnerAssignmentStatuses } from "~/hooks/course/useLearnerAssignmentStatuses";
import { useAccessToken } from "~/hooks/onchain/useAccessToken";
import useGlobalStateDatum from "~/hooks/onchain/useGlobalStateDatum";
import CourseDetails from "./CourseDetails";
import LearnerCourses from "./LearnerCourses";
import MintAccessTokenDialog from "~/components/transactions/dialogs/MintAccessTokenDialog";
import { useRouter } from "next/router";
import DashboardDataComponent from "~/ui/dashboard/components/DashboardDataComponent";

export default function LearnerComponent() {
  const { connected } = useWallet();
  const { accessTokenAlias } = useAccessToken();
  const { globalStateDatum } = useGlobalStateDatum(accessTokenAlias ?? "");
  const { learnerAssignments } = useLearnerAssignmentStatuses();

  const router = useRouter();
  const { coursecode } = router.query;

  return (
    <div className="flex w-full flex-col">
      <div className="mx-auto flex flex-col">
        {/* If a course is selected, show COURSE DETAILS. Otherwise, show LEARNER OVERVIEW */}
        {!!coursecode && typeof coursecode === "string" ? (
          <CourseDetails
            currentCourseCode={coursecode}
            learnerAssignments={learnerAssignments}
            globalStateDatum={globalStateDatum}
          />
        ) : (
          <div className="mx-auto grid w-full grid-cols-5 gap-5">
            {!connected && (
              <div className="col-span-5 flex min-h-[60vh] items-center justify-center">
                <CardanoWallet />
              </div>
            )}
            {connected && !accessTokenAlias && (
              <div className="col-span-5 flex min-h-[60vh] items-center justify-center">
                <div>
                  <MintAccessTokenDialog />
                </div>
              </div>
            )}
            {connected && accessTokenAlias && (
              <>
                <div className="col-span-4 flex min-h-[60vh] w-full flex-col items-center">
                  {accessTokenAlias && (
                    <LearnerCourses
                      alias={accessTokenAlias}
                      learnerAssignments={learnerAssignments}
                    />
                  )}
                </div>
                <div className="col-span-1 col-start-5 row-span-9 flex flex-col gap-5">
                  {connected && accessTokenAlias && (
                    <DashboardDataComponent
                      title="Your Access Token"
                      data={accessTokenAlias ?? ""}
                    />
                  )}
                  <DashboardDataComponent
                    title="Courses"
                    data={globalStateDatum?.TokenInfos.length.toString() ?? ""}
                  />
                  <DashboardDataComponent
                    title="My Assignments"
                    data={learnerAssignments.length.toString() ?? ""}
                  />
                </div>
              </>
            )}
            {/* Explore implementation of Goals - unique Epic */}
            {/* <div className="col-span-3 border border-primary p-5"> */}
            {/*   <p>My Goals - Needed Prereqs or otherwise saved Courses</p> */}
            {/* </div> */}
            <div className="col-span-5 bg-secondary p-5 text-center text-secondary-foreground">
              <p className="mb-5 text-2xl">Ready to Explore?</p>
              <Link href="/courses">
                <Button>View all Courses</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
