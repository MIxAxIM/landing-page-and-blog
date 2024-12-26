
import { useRouter } from "next/router";
import { z } from "zod";
import ConnectWalletCard from "~/components/cardano/common/ConnectWalletCard";
import AppLayout from "~/components/layout/AppLayout";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import PublicTaskPageComponent from "~/ui/project/PublicTaskPageComponent";
import TaskCommitmentComponent from "~/ui/project/TaskCommitmentComponent";

const taskCommitmentParamsSchema = z.object({
  treasurynft: z.string().min(1),
  projecthash: z.string().min(1),
});

export default function ProjectTaskStudioPage() {
  const router = useRouter();

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
  const { accessTokenAlias } = useAccessToken()

  return (
    <DesktopOnlyLayout>
      <AppLayout>
        <div className="flex w-full bg-primary text-primary-foreground p-5">
          PREVIEW MODE
        </div>
        <PublicTaskPageComponent projectHash={projecthash} />
        <div className="max-w-5xl mx-auto mb-24">
          {!!accessTokenAlias ? (
            <TaskCommitmentComponent treasuryNftPolicyId={treasurynft} projectHash={projecthash} alias={accessTokenAlias} />
          ) : (
            <ConnectWalletCard message={"Please connect a wallet"} />
          )}
        </div>
      </AppLayout>
    </DesktopOnlyLayout >

  )
}

