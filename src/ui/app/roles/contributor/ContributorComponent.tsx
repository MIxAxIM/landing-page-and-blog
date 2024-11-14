import AllTasksListComponent from "~/ui/contribution/lists/AllTasksListComponent";
import PlaceholderComponent from "~/ui/prototype/PlaceholderComponent";

export default function ContributorComponent() {
  return (
    <div>
      <PlaceholderComponent name="Contributor Page" />
      <AllTasksListComponent />
    </div>
  );
}
