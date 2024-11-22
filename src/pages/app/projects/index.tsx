import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import ProjectsPageComponent from "~/ui/app/ProjectsPageComponent";

export default function ProjectsPage() {
  return (
    <DesktopOnlyLayout>
      <ProjectsPageComponent />
    </DesktopOnlyLayout>
  );
}
