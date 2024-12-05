import { useRouter } from "next/router";
import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import MenuBar from "~/ui/landing/MenuBar";

export default function ProjectPage() {
    const router = useRouter();
    const { project, task } = router.query;
    return (
        <DesktopOnlyLayout>
            <MenuBar />
            <h1>Project: {project}</h1>
            <h2>Task: {task}</h2>
        </DesktopOnlyLayout>
    )
}