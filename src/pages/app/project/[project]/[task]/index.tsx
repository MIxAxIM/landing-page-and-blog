import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ContentEditor from "~/components/editor/ContentEditor";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import { useTaskCommitment } from "~/hooks/db/contribution/useTaskCommitment";
import useTaskCommitmentEditor from "~/ui/contribution/useTaskCommitmentEditor";
import MenuBar from "~/ui/landing/MenuBar";

export default function ProjectPage() {
    const { data: sessionData } = useSession()
    const router = useRouter();
    const { project, task } = router.query;
    const { taskCommitments } = useTaskCommitment({ taskId: task as string, contributorId: sessionData?.user?.contributorId });

    const { editor } = useTaskCommitmentEditor(task as string);
    // 1. Check visible
    // 2. save evidence content
    return (
        <DesktopOnlyLayout>
            <MenuBar />
            <h1>Project: {project}</h1>
            <h2>Task: {task}</h2>
            {!!editor && (
                <ContentEditor editor={editor} />
            )}
        </DesktopOnlyLayout>
    )
}
