import { useSession } from "next-auth/react";
import { useAccessToken } from "~/hooks/onchain/useAccessToken";
import RoleStatus from "~/ui/dashboard/components/RoleStatus";

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
            roleName="Contributor"
            userHasRole={true}
            roleInfoUrl="/app/contribute"
            current={dashboardChildRoute === "contributor"}
          />
          <RoleStatus
            roleName="Organizer"
            userHasRole={true}
            roleInfoUrl="/app/organize"
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
