import AppLayout from "~/components/layout/AppLayout";
import LearnerComponent from "./roles/learner/LearnerComponent";

export default function LearnerPageComponent() {
  return (
    <AppLayout>
      <div className="mx-auto my-24 w-11/12 space-y-5">
        <h2>Learner Page</h2>
        <LearnerComponent />
      </div>
    </AppLayout>
  );
}
