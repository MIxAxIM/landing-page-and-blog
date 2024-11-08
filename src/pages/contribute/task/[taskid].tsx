import { useRouter } from "next/router";
import { useTask } from "~/hooks/contribution/useTask";
import PublicTaskPageComponent from "~/ui/contribution/PublicTaskPageComponent";
import MenuBar from "~/ui/landing/MenuBar";
import { VideoBackground } from "~/ui/landing/SB7PageLanding";

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
    <>
      <VideoBackground>
        <MenuBar />
        <PublicTaskPageComponent task={task} />
      </VideoBackground>
    </>
  );
}
