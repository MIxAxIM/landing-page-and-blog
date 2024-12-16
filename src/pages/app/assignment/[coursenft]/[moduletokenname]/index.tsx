import { useRouter } from "next/router";
import { z } from "zod";
import ConnectWalletCard from "~/components/cardano/common/ConnectWalletCard";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import AssignmentCommitmentPageComponent from "~/ui/app/AssignmentCommitmentPageComponent";
import MenuBar from "~/ui/landing/MenuBar";

const assignmentCommitmentParamsSchema = z.object({
  coursenft: z.string().min(1),
  moduletokenname: z.string().min(1),
});

export default function AssignmentCommitmentPage() {
  const router = useRouter();

  if (!router.isReady) {
    return <div>Loading...</div>; // Or your preferred loading component
  }
  const result = assignmentCommitmentParamsSchema.safeParse(router.query);
  if (!result.success) {
    // Handle invalid params - could redirect or show error
    router.push('/404');
    return null;
  }

  const { coursenft, moduletokenname } = result.data;

  const { accessTokenAlias } = useAccessToken()

  return (
    <DesktopOnlyLayout>
      <MenuBar />
      {!!accessTokenAlias ? (
        <AssignmentCommitmentPageComponent courseNftPolicyId={coursenft} moduleTokenName={moduletokenname} />
      ) : (
        <ConnectWalletCard message={"Please connect a wallet"} />
      )}
    </DesktopOnlyLayout >

  )
}

