import PlaceholderComponent from "~/components/placeholders/PlaceholderComponent";
import MyProjectsListComponent from "./roles/contribution-manager/MyProjectsListComponent";
import AppLayout from "~/components/layout/AppLayout";

export default function ProjectsPageComponent() {
  return (
    <AppLayout>
      <div className="mx-auto my-24 w-2/3 space-y-5">
        <h2>Organizer Page</h2>
        <div className="flex w-full flex-col">
          Your Projects:
        </div>
        <MyProjectsListComponent />
        <PlaceholderComponent name="Task view?">
          <div>
            What does the contribution manager need to see?
          </div>
        </PlaceholderComponent>
      </div>
    </AppLayout>
  );
}
