
import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import AdminPageComponent from "~/ui/app/AdminPageComponent";

export default function AdminPage() {
  return (
    <DesktopOnlyLayout>
      <AdminPageComponent />
    </DesktopOnlyLayout>
  );
}
