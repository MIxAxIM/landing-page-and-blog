import { useSession } from "next-auth/react";
import RoleStatus from "~/ui/dashboard/components/RoleStatus";

export default function AndamioDashboardMenu() {
  const { data: sessionData } = useSession();
  return (
    <>
      <div className="grid w-full grid-cols-1 gap-1">
        <ul role="list" className="">
          <RoleStatus
            roleName="Profile"
            userHasRole={!!sessionData}
            roleDetail={sessionData?.user.name ?? undefined}
            roleInfoUrl="/dashboard/profile"
          />
          <RoleStatus
            roleName="Subscription"
            userHasRole={!!sessionData}
            roleInfoUrl="/dashboard/subscription"
          />
          <RoleStatus
            roleName="Network Credentials"
            userHasRole={!!sessionData}
            roleInfoUrl="/dashboard/network-credentials"
          />
        </ul>
      </div>
    </>
  );
}
