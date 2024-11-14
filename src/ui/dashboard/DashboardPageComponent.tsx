import DashboardNetworkStatusComponent from "./components/DashboardNetworkStatusComponent";
import ProfileLayout from "./layout/ProfileLayout";

export default function DashboardPage() {
  return (
    <ProfileLayout>
      <DashboardNetworkStatusComponent />
    </ProfileLayout>
  );
}
