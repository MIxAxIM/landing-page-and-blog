import { useEffect, useState } from "react";
import ManageEscrowComponent from "./roles/contribution-manager/ManageEscrowComponent";
import AppLayout from "~/components/layout/AppLayout";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import useAggregateUserInfo from "~/hooks/cardano-indexer-api/network/useAggregateUserInfo";
import { useEscrow } from "~/hooks/db/contribution/useEscrow";
import PlaceholderComponent from "~/components/placeholders/PlaceholderComponent";
import { useSession } from "next-auth/react";
import { useRoles } from "~/hooks/app/useRoles";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import ProjectTaskContributionList from "../contribution/lists/ProjectTaskContributionList";
import { useTreasury } from "~/hooks/db/contribution/useTreasury";
import BurnContributorStateDialog from "~/components/cardano/tx/contributor/burn-contributor-state/BurnContributorStateDialog";
import MintProjectStateDialog from "~/components/cardano/tx/contributor/mint-project-state/MintProjectStateDialog";

export default function PublicTreasuryLandingPageComponent({
  treasuryNftPolicyId,
}: {
  treasuryNftPolicyId: string;
}) {
  const { data: sessionData } = useSession()
  const { accessTokenAlias } = useAccessToken()
  const { aggregateUserInfo } = useAggregateUserInfo()
  const [isManager, setIsManager] = useState<boolean>(false)
  const [isContributor, setIsContributor] = useState<boolean>(false)
  const { treasuryByPolicyId } = useTreasury(treasuryNftPolicyId);
  const { enableContributor } = useRoles()

  useEffect(() => {
    if (sessionData?.user && !sessionData.user.contributorId) {
      void enableContributor();
    }
  }, [sessionData, enableContributor]);

  useEffect(() => {
    if (aggregateUserInfo?.alias === accessTokenAlias) {
      if (aggregateUserInfo?.manager.includes(treasuryNftPolicyId)) {
        setIsManager(true)
      }
      if (aggregateUserInfo?.projects.ongoing.some(p => p.policy === treasuryNftPolicyId)) {
        setIsContributor(true)
      }
    }
  }, [aggregateUserInfo])

  const { treasuryEscrows } = useEscrow({ treasuryNftPolicyId });

  if (!treasuryEscrows?.escrows || treasuryEscrows?.escrows.length === 0 || !treasuryEscrows?.escrows[0]) return

  return (
    <AppLayout>
      <div className="mx-auto w-5/6 my-24">
        <div className="flex flex-row justify-between items-center">
          <h1>{treasuryByPolicyId?.title}</h1>
          <MintProjectStateDialog treasuryNftPolicyId={treasuryNftPolicyId} />
        </div>
        <p className="prose my-12">{treasuryByPolicyId?.description}</p>
        {isContributor && (
          <Card>
            <CardHeader>
              You are a contributor to this project
            </CardHeader>
            <CardContent>
              <BurnContributorStateDialog treasuryNftPolicyId={treasuryNftPolicyId} />
            </CardContent>
          </Card>
        )}
        {isManager && (
          <Card>
            You are a creator of this project
          </Card>
        )}
        <ProjectTaskContributionList
          treasuryNftPolicyId={treasuryNftPolicyId}
          showFilters={true}
        />
      </div>
    </AppLayout>
  );
}

