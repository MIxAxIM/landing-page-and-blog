import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import DashboardPageComponent from "~/ui/dashboard/DashboardPageComponent";

export default function DashboardPage() {
  return (
    <DesktopOnlyLayout>
      <DashboardPageComponent />
    </DesktopOnlyLayout>
  );
}
