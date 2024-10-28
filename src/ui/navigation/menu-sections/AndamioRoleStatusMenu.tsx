import { useSession } from "next-auth/react";
import RoleStatus from "~/ui/profile/components/RoleStatus";
import { useAccessToken } from "~/hooks/onchain/useAccessToken";

export default function AndamioRoleStatusMenu({
  dashboardChildRoute,
}: {
  dashboardChildRoute: string;
}) {
  const { data: sessionData } = useSession();
  const { accessTokenAlias } = useAccessToken();
  return (
    <>
      <div className="grid w-full grid-cols-1 gap-1">
        <ul role="list" className="">
          <RoleStatus
            roleName="Discord Account"
            userHasRole={!!sessionData}
            roleDetail={sessionData?.user.name ?? undefined}
          />
          <RoleStatus
            roleName="Learner Dashboard"
            userHasRole={!!sessionData?.user.learnerId}
            roleInfoUrl="/dashboard/learner"
            current={dashboardChildRoute === "learner"}
          />
          {!!sessionData?.user.creatorId && (
            <RoleStatus
              roleName="Teacher Dashboard"
              userHasRole={!!sessionData?.user.creatorId}
              roleInfoUrl="/dashboard/teacher"
              current={dashboardChildRoute === "teacher"}
            />
          )}
          <RoleStatus
            roleName="Contributor Dashboard"
            userHasRole={true}
            roleInfoUrl="/dashboard/contributor"
            current={dashboardChildRoute === "contributor"}
          />
          <RoleStatus
            roleName="Contribution Manager Dashboard"
            userHasRole={true}
            roleInfoUrl="/dashboard/contribution-manager"
            current={dashboardChildRoute === "contribution-manager"}
          />
          <RoleStatus
            roleName="Access Token Overview"
            userHasRole={!!accessTokenAlias}
            roleDetail={accessTokenAlias}
            roleInfoUrl="/dashboard"
          />
        </ul>
      </div>
    </>
  );
}
