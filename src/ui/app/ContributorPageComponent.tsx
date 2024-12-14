import AppLayout from "~/components/layout/AppLayout";
import PublicTreasuryListComponent from "../contribution/lists/PublicTreasuryListComponent";

export default function ContributorPageComponent() {
  return (
    <AppLayout>
      <div className="mx-auto my-24 w-2/3 space-y-5">
        <h1>Andamio Contributors</h1>
        <h2>Public Treasuries</h2>
        <PublicTreasuryListComponent />
      </div>
    </AppLayout>
  );
}
