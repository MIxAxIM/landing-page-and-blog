import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import PublicProjectsPageComponent from "~/ui/app/PublicProjectsPageComponent";

export default function ProjectsPage() {
  return (
    <DesktopOnlyLayout>
      <PublicProjectsPageComponent />
    </DesktopOnlyLayout>
  );
}
