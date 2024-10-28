import DesktopOnlyLayout from "~/components/DesktopOnlyLayout";
import ContributionManagerPage from "~/ui/profile/ContributionManagerPage";

export default function DashboardContributionManagerPage() {
  return (
    <DesktopOnlyLayout>
      <ContributionManagerPage />
    </DesktopOnlyLayout>
  );
}
