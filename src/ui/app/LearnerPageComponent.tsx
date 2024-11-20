import LearnerComponent from "./roles/learner/LearnerComponent";
import AppLayout from "../app/layout/AppLayout";

export default function LearnerPageComponent() {
  return (
    <AppLayout>
      <div className="mx-auto my-24 w-2/3 space-y-5">
        <h2>Learner Page</h2>
        <LearnerComponent />
      </div>
    </AppLayout>
  );
}
