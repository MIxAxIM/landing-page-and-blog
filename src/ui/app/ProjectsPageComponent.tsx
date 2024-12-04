import AppLayout from "~/components/layout/AppLayout";
import ContributionManagerComponent from "./roles/contribution-manager/ContributionManagerComponent";

export default function ProjectsPageComponent() {
  return (
    <AppLayout>
      <div className="mx-auto my-24 w-2/3 space-y-5">
        <ContributionManagerComponent />
      </div>
    </AppLayout>
  );
}
