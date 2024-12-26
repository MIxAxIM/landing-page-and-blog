import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import PublicProjectsPageComponent from "~/ui/project/PublicProjectsPageComponent";

export default function ProjectsPage() {
  return (
    <DesktopOnlyLayout>
      <PublicProjectsPageComponent />
    </DesktopOnlyLayout>
  );
}
