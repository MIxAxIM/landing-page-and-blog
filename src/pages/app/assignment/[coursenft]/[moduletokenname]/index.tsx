import { useRouter } from "next/router";
import { z } from "zod";
import ConnectWalletCard from "~/components/cardano/common/ConnectWalletCard";
import AppLayout from "~/components/layout/AppLayout";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import useCourseByPolicyId from "~/hooks/cardano-indexer-api/course/useCourseByPolicyId";
import { useAccessToken } from "~/hooks/cardano-indexer-api/network/useAccessToken";
import AssignmentCommitmentPageComponent from "~/ui/app/AssignmentCommitmentPageComponent";
//import AssignmentContent from "~/ui/app/AssignmentCommitmentPageComponent/AssignmentContent";

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
  const { courseInfo } = useCourseByPolicyId(coursenft);

  if (!courseInfo) return

  return (
    <DesktopOnlyLayout>
      <AppLayout>
        <div className="w-5/6 mx-auto my-24">
          <h3>
            Todo: Consider adding Assignment Content here - explore user stories that de-emphasize the  use of lesson content
          </h3>
          {!!accessTokenAlias ? (
            <AssignmentCommitmentPageComponent courseCode={courseInfo.courseCode} moduleCode={moduletokenname} courseNftPolicyId={coursenft} />
          ) : (
            <ConnectWalletCard message={"Please connect a wallet"} />
          )}
        </div>
      </AppLayout>
    </DesktopOnlyLayout >
  )
}

