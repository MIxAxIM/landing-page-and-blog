
import { useRouter } from "next/router";
import { z } from "zod";
import AppLayout from "~/components/layout/AppLayout";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import PreviewManageEscrowComponent from "~/ui/studio/project/PreviewManageEscrowComponent";

const projectPageParamsSchema = z.object({
  escrowid: z.string().min(1),
});

export default function ProjectTreasuryLandingPage() {
  const router = useRouter();

  if (!router.isReady) {
    return <div>Loading...</div>; // Or your preferred loading component
  }
  const result = projectPageParamsSchema.safeParse(router.query);
  if (!result.success) {
    // Handle invalid params - could redirect or show error
    router.push('/404');
    return null;
  }

  const { escrowid } = result.data;

  return (
    <DesktopOnlyLayout>
      <AppLayout>
        <div className="mx-auto w-5/6 ">
          <PreviewManageEscrowComponent escrowId={escrowid} />
        </div>
      </AppLayout>
    </DesktopOnlyLayout >

  )
}

