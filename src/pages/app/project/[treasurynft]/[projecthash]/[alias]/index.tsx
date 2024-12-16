
import { useRouter } from "next/router";
import { z } from "zod";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import TaskCommitmentPageComponent from "~/ui/app/TaskCommitmentPageComponent";
import MenuBar from "~/ui/landing/MenuBar";

const taskCommitmentParamsSchema = z.object({
  treasurynft: z.string().min(1),
  projecthash: z.string().min(1),
  alias: z.string().optional()
});

export default function ProjectTaskCommitmentPageWithAlias() {
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

  const { treasurynft, projecthash, alias } = result.data;

  return (
    <DesktopOnlyLayout>
      <MenuBar />
      <TaskCommitmentPageComponent treasuryNftPolicyId={treasurynft} projectHash={projecthash} alias={alias} />
    </DesktopOnlyLayout >

  )
}

