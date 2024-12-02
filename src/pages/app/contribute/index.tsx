import DesktopOnlyLayout from "~/components/layout/DesktopOnlyLayout";
import ContributorPageComponent from "~/ui/app/ContributorPageComponent";

export default function ContributePage() {
  return (
    <DesktopOnlyLayout>
      <ContributorPageComponent />
    </DesktopOnlyLayout>
  );
}
