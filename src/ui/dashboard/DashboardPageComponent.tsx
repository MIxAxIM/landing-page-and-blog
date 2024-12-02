import ProfileLayout from "~/components/layout/ProfileLayout";
import DashboardNetworkStatusComponent from "./components/DashboardNetworkStatusComponent";

export default function DashboardPage() {
  return (
    <ProfileLayout>
      <DashboardNetworkStatusComponent />
    </ProfileLayout>
  );
}
