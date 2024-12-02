import AllTasksListComponent from "~/ui/contribution/lists/AllTasksListComponent";
import PlaceholderComponent from "~/components/placeholders/PlaceholderComponent";

export default function ContributorComponent() {
  return (
    <div>
      <PlaceholderComponent name="Contributor Page" />
      <AllTasksListComponent />
    </div>
  );
}
