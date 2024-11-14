import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import OrganizerPageComponent from "~/ui/app/OrganizerPageComponent";

export default function OrganizePage() {
  return (
    <DesktopOnlyLayout>
      <OrganizerPageComponent />
    </DesktopOnlyLayout>
  );
}
