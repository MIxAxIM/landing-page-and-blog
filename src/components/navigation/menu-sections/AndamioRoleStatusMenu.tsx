import { useSession } from "next-auth/react";
import { useTerminology } from "~/contexts/terminology-context";
import { useAccessToken } from "~/hooks/cardano-indexer-api/useAccessToken";
import RoleStatus from "~/ui/dashboard/components/RoleStatus";

export default function AndamioRoleStatusMenu({
  dashboardChildRoute,
}: {
  dashboardChildRoute: string;
}) {
  const { data: sessionData } = useSession();
  const { accessTokenAlias } = useAccessToken();
  const { translateCaps } = useTerminology()
  return (
    <>
      <div className="grid w-full grid-cols-1 gap-1">
        <ul role="list" className="">
          <RoleStatus
            roleName="Learner"
            userHasRole={!!sessionData?.user.learnerId}
            roleInfoUrl="/app/learn"
            current={dashboardChildRoute === "learner"}
          />
          {!!sessionData?.user.creatorId && (
            <RoleStatus
              roleName="Teacher"
              userHasRole={!!sessionData?.user.creatorId}
              roleInfoUrl="/app/teach"
              current={dashboardChildRoute === "teacher"}
            />
          )}
          <RoleStatus
            roleName={`${translateCaps('contributor')}`}
            userHasRole={true}
            roleInfoUrl="/app/contribute"
            current={dashboardChildRoute === "contributor"}
          />
          <RoleStatus
            roleName={`${translateCaps('contributionManager')}`}
            userHasRole={true}
            roleInfoUrl="/app/projects"
            current={dashboardChildRoute === "contribution-manager"}
          />
          <RoleStatus
            roleName="Access Token Overview"
            userHasRole={!!accessTokenAlias}
            roleDetail={accessTokenAlias}
            roleInfoUrl="/dashboard"
          />
          <RoleStatus
            roleName={`${translateCaps('prerequisite')} Studio`}
            userHasRole={true}
            roleInfoUrl="/app/prerequisite-minter"
          />
          <RoleStatus
            roleName={`Andamio Admin (private)`}
            userHasRole={!!sessionData?.user.isAdmin}
            roleInfoUrl="/app/admin"
          />
        </ul>
      </div>
    </>
  );
}
