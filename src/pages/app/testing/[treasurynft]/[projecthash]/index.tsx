
import { useRouter } from "next/router";
import { z } from "zod";
import ConnectWalletCard from "~/components/cardano/common/ConnectWalletCard";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import TaskCommitmentPage from "~/ui/app/TaskCommitmentPage";
import MenuBar from "~/ui/landing/MenuBar";

const taskCommitmentParamsSchema = z.object({
  treasurynft: z.string().min(1),
  projecthash: z.string().min(1),
});

export default function ProjectTaskCommitmentPage() {
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
      <MenuBar />
      {!!accessTokenAlias ? (
        <TaskCommitmentPage treasuryNftPolicyId={treasurynft} projectHash={projecthash} alias={accessTokenAlias} />
      ) : (
        <ConnectWalletCard message={"Please connect a wallet"} />
      )}
    </DesktopOnlyLayout >

  )
}

