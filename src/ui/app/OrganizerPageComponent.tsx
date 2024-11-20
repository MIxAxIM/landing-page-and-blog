
import AppLayout from "../app/layout/AppLayout";
import TreasuryListComponent from "../contribution/lists/TreasuryListComponent";
import PlaceholderComponent from "../prototype/PlaceholderComponent";

export default function OrganizerPageComponent() {
  return (
    <AppLayout>
      <div className="mx-auto my-24 w-2/3 space-y-5">
        <h2>Organizer Page</h2>
        <div className="flex w-full flex-col">
          Some organizer stuff
        </div>
        <TreasuryListComponent />
        <PlaceholderComponent name="Task view?">
          <div>
            What does the contribution manager need to see?
          </div>
        </PlaceholderComponent>
      </div>
    </AppLayout>
  );
}
