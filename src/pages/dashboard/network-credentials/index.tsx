import DashboardNetworkStatusComponent from "~/ui/dashboard/components/DashboardNetworkStatusComponent";
import ProfileLayout from "~/ui/dashboard/layout/ProfileLayout";

export default function NetworkCredentialsPage() {
  return (
    <ProfileLayout>
      <DashboardNetworkStatusComponent />
    </ProfileLayout>
  );
}
