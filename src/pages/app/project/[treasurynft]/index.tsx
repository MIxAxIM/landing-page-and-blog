
import { useRouter } from "next/router";
import { z } from "zod";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import MenuBar from "~/ui/landing/MenuBar";

const taskCommitmentParamsSchema = z.object({
  treasurynft: z.string().length(56),
});

export default function ProjectTreasuryLandingPage() {
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

  const { treasurynft } = result.data;

  return (
    <DesktopOnlyLayout>
      <MenuBar />
      <div>ProjectTreasuryLandingPage</div>
      <div>treasurynft: {treasurynft}</div>
    </DesktopOnlyLayout >

  )
}

