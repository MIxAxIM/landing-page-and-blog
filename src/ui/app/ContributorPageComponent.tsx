import AppLayout from "../app/layout/AppLayout";
import AllTasksListComponent from "../contribution/lists/AllTasksListComponent";

export default function ContributorPageComponent() {
  return (
    <AppLayout>
      <div className="mx-auto my-24 w-2/3 space-y-5">
        <h2>Contributor Page</h2>
        <AllTasksListComponent />
      </div>
    </AppLayout>
  );
}
