import { useRouter } from "next/router";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import { useTask } from "~/hooks/db/contribution/useTask";
import AppLayout from "~/components/layout/AppLayout";
import PublicTaskPageComponent from "~/ui/contribution/PublicTaskPageComponent";

export default function PublicTaskPage() {
  const router = useRouter();
  const { taskid } = router.query;

  // Only call useTask if taskid is a string
  const { task, isLoadingTask } = useTask({
    id: typeof taskid === "string" ? taskid : undefined,
  });

  if (isLoadingTask) {
    return <div>Loading...</div>;
  }

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <DesktopOnlyLayout>
      <AppLayout>
        <PublicTaskPageComponent task={task} />
      </AppLayout>
    </DesktopOnlyLayout>
  );
}
