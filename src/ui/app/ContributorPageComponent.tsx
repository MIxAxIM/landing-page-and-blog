import AppLayout from "~/components/layout/AppLayout";
import PublicTreasuryListComponent from "../contribution/lists/PublicTreasuryListComponent";

export default function ContributorPageComponent() {
  return (
    <AppLayout>
      <div className="mx-auto my-24 w-2/3 space-y-5">
        <PublicTreasuryListComponent />
      </div>
    </AppLayout>
  );
}
