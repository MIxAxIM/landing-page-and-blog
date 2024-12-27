import { useEffect, useState } from "react";
import AppLayout from "~/components/layout/AppLayout";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import useAggregateUserInfo from "~/hooks/cardano-indexer-api/network/useAggregateUserInfo";
import { useEscrow } from "~/hooks/db/contribution/useEscrow";
import PlaceholderComponent from "~/components/placeholders/PlaceholderComponent";
import { useSession } from "next-auth/react";
import { useRoles } from "~/hooks/app/useRoles";
import ManageEscrowComponent from "./ManageEscrowComponent";

export default function StudioProjectPage({
  treasuryNftPolicyId,
}: {
  treasuryNftPolicyId: string;
}) {
  const { data: sessionData } = useSession()
  const { accessTokenAlias } = useAccessToken()
  const { aggregateUserInfo } = useAggregateUserInfo()
  const [isManager, setIsManager] = useState<boolean>(false)
  const { enableContributionManager } = useRoles()

  useEffect(() => {
    if (sessionData?.user && !sessionData.user.contributionManagerId) {
      void enableContributionManager();
    }
  }, [sessionData, enableContributionManager]);

  useEffect(() => {
    if (aggregateUserInfo?.alias === accessTokenAlias) {
      if (aggregateUserInfo?.manager.includes(treasuryNftPolicyId)) {
        setIsManager(true)
      }
    }
  }, [aggregateUserInfo])

  // NOTE:
  // MVP - Get the first escrow for the treasuryNftPolicyId, because we only have one escrow per treasuryNftPolicyId
  // Future - A treasury can have multiple escrows
  const { treasuryEscrows } = useEscrow({ treasuryNftPolicyId });

  if (!treasuryEscrows?.escrows || treasuryEscrows?.escrows.length === 0 || !treasuryEscrows?.escrows[0]) return

  return (
    <AppLayout>
      <div className="mx-auto w-5/6 ">
        {isManager && (
          <ManageEscrowComponent escrowId={treasuryEscrows.escrows[0].id} treasuryNftPolicyId={treasuryNftPolicyId} />
        )}
        {!isManager && (
          <div>
            <PlaceholderComponent name="You do not have access to this project" />
          </div>
        )}
      </div>
    </AppLayout>
  );
}

