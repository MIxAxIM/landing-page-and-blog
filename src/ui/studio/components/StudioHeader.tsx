import { useSubscriptionAccess } from "~/hooks/app/useSubscriptionAccess";
import DialogCourse from "./dialogs/DialogCourse";

export default function StudioHeader() {
  const { canCreateCourse } = useSubscriptionAccess()
  return (
    <div className="flex min-h-[150px] items-center">
      <div className="flex-grow">
        <h1>Your Courses</h1>
      </div>
      {canCreateCourse.data?.hasAccess && (
        <div>
          <DialogCourse />
        </div>
      )}
    </div>
  );
}
