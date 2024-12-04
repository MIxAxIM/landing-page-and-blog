import AppLayout from "~/components/layout/AppLayout";
import ContributionManagerComponent from "./roles/contribution-manager/ContributionManagerComponent";

export default function ProjectsPageComponent() {
  return (
    <AppLayout>
      <div className="mx-auto my-24 w-5/6 space-y-5">
        <ContributionManagerComponent />
      </div>
    </AppLayout>
  );
}
