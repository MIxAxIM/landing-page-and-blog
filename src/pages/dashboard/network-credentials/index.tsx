import DashboardNetworkStatusComponent from "~/ui/dashboard/components/DashboardNetworkStatusComponent";
import ProfileLayout from "~/components/layout/ProfileLayout";

export default function NetworkCredentialsPage() {
  return (
    <ProfileLayout>
      <DashboardNetworkStatusComponent />
    </ProfileLayout>
  );
}
