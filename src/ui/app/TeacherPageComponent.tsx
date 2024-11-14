

import AppLayout from "../app/layout/AppLayout";
import PlaceholderComponent from "../prototype/PlaceholderComponent";

export default function TeacherPageComponent() {
  return (
    <AppLayout>
      <div className="mx-auto my-24 w-2/3 space-y-5">
        <h2 className="my-10 text-4xl">Teacher Page</h2>
        <div className="flex w-full flex-col">
          Teacher stuff
        </div>
        <PlaceholderComponent name="Course credentials and assignments">
          <div>
            What does the teacher need to see on the andamio network?
          </div>
        </PlaceholderComponent>
      </div>
    </AppLayout>
  );
}
