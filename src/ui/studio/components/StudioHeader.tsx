import { useSubscriptionAccess } from "~/hooks/app/useSubscriptionAccess";
import DialogCourse from "./dialogs/DialogCourse";

export default function StudioHeader() {
  const { canCreateCourse } = useSubscriptionAccess()
  return (
    <div className="flex min-h-[150px] items-center">
      <div className="flex-grow">
        <h1 className="text-2xl font-bold md:text-6xl">Your Courses</h1>
      </div>
      {canCreateCourse.data?.hasAccess && (
        <div>
          <DialogCourse />
        </div>
      )}
    </div>
  );
}
