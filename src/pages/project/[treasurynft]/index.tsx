import { useRouter } from "next/router";
import { z } from "zod";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import PublicTreasuryLandingPageComponent from "~/ui/project/PublicTreasuryLandingPageComponent";

const projectPageParamsSchema = z.object({
  treasurynft: z.string().length(56),
});

export default function ProjectTreasuryLandingPage() {
  const router = useRouter();

  if (!router.isReady) {
    return <div>Loading...</div>; // Or your preferred loading component
  }
  const result = projectPageParamsSchema.safeParse(router.query);
  if (!result.success) {
    // Handle invalid params - could redirect or show error
    void router.push('/404');
    return null;
  }

  const { treasurynft } = result.data;

  return (
    <DesktopOnlyLayout>
      <PublicTreasuryLandingPageComponent treasuryNftPolicyId={treasurynft} />
    </DesktopOnlyLayout >

  )
}

