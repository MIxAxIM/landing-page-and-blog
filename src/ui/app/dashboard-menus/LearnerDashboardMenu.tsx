import Link from "next/link";
import { useRouter } from "next/router";
import { useAccessToken } from "~/hooks/cardano-indexer-api/useAccessToken";
import useGlobalStateDatum from "~/hooks/cardano-indexer-api/global-state/useGlobalStateDatum";
import SavedCourses from "~/ui/app/roles/learner/SavedCourses";
import AndamioNetworkCourses from "~/ui/app/roles/learner/AndamioNetworkCourses";
import { CardanoWallet } from "@meshsdk/react";

export default function LearnerDashboardMenu() {
  const { accessTokenAlias } = useAccessToken();
  const { globalStateDatum } = useGlobalStateDatum(accessTokenAlias ?? "");
  const router = useRouter();

  const isAssignmentRoute = router.asPath.includes(
    "dashboard/learner/assignments",
  );

  return (
    <div className="grid min-h-28 w-full grid-cols-6 items-center gap-5 bg-primary text-primary-foreground">
      <div className="col-start-1 text-center">
        <Link href="/dashboard/learner">
          <div className={`cursor-pointer p-2 font-semibold`}>
            Learner Dashboard Home
          </div>
        </Link>
      </div>
      <div className="col-span-2 col-start-2">
        {globalStateDatum ? (
          <AndamioNetworkCourses globalStateDatum={globalStateDatum} />
        ) : (
          <CardanoWallet />
        )}
      </div>
      <div className="col-span-2 col-start-4">
        <SavedCourses />
      </div>
      <div className="col-start-6 text-center">
        <Link href="/dashboard/learner/assignments">
          <div
            className={`cursor-pointer p-2 font-semibold ${isAssignmentRoute ? "bg-accent" : "bg-primary text-primary-foreground"}`}
          >
            All Assignment Notes
          </div>
        </Link>
      </div>
    </div>
  );
}
