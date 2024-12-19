import Link from "next/link";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import useGlobalStateDatum from "~/hooks/cardano-indexer-api/network/useGlobalStateDatum";
import SavedCourses from "~/ui/app/roles/learner/SavedCourses";
import AndamioNetworkCourses from "~/ui/app/roles/learner/AndamioNetworkCourses";
import { CardanoWallet } from "@meshsdk/react";

export default function LearnerDashboardMenu() {
  const { accessTokenAlias } = useAccessToken();
  const { globalStateDatum } = useGlobalStateDatum(accessTokenAlias ?? "");

  return (
    <div className="grid min-h-28 w-full grid-cols-6 items-center gap-5 bg-primary text-primary-foreground">
      <div className="col-start-1 text-center">
        <Link href="/dashboard">
          <div className={`cursor-pointer p-2 font-semibold`}>
            Dashboard
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
        <Link href="/course">
          <div className={`cursor-pointer p-2 font-semibold`}>
            Browse More Courses
          </div>
        </Link>
      </div>
    </div>
  );
}
