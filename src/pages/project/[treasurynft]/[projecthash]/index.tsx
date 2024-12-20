import { useRouter } from "next/router";
import { z } from "zod";
import ConnectWalletCard from "~/components/cardano/common/ConnectWalletCard";
import AppLayout from "~/components/layout/AppLayout";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import useAggregateUserInfo from "~/hooks/cardano-indexer-api/network/useAggregateUserInfo";
import PublicTaskPageComponent from "~/ui/contribution/PublicTaskPageComponent";
import TaskCommitmentComponent from "~/ui/project/TaskCommitmentComponent";

const taskCommitmentParamsSchema = z.object({
  treasurynft: z.string().min(1),
  projecthash: z.string().min(1),
});

export default function ProjectTaskCommitmentPage() {
  const router = useRouter();
  const { qualifiedTreasuryNftPolicyIds } = useAggregateUserInfo()
  const { accessTokenAlias } = useAccessToken()

  if (!router.isReady) {
    return <div>Loading...</div>; // Or your preferred loading component
  }
  const result = taskCommitmentParamsSchema.safeParse(router.query);
  if (!result.success) {
    // Handle invalid params - could redirect or show error
    router.push('/404');
    return null;
  }
  const { treasurynft, projecthash } = result.data;

  return (
    <DesktopOnlyLayout>
      <AppLayout>
        <div className="w-2/3 mx-auto">
          {!!(qualifiedTreasuryNftPolicyIds?.includes(treasurynft)) ? (
            <TaskCommitmentComponent treasuryNftPolicyId={treasurynft} projectHash={projecthash} alias={accessTokenAlias} />
          ) : (
            <ConnectWalletCard message={"Please connect a wallet"} />
          )}
          <PublicTaskPageComponent projectHash={projecthash} />
        </div>
      </AppLayout>
    </DesktopOnlyLayout >

  )
}

