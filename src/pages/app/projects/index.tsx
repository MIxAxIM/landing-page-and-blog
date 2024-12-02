import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import ProjectsPageComponent from "~/ui/app/ProjectsPageComponent";

export default function ProjectsPage() {
  return (
    <DesktopOnlyLayout>
      <ProjectsPageComponent />
    </DesktopOnlyLayout>
  );
}
