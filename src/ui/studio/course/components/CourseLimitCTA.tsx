import { useSubscriptionAccess } from "~/hooks/app/useSubscriptionAccess";
import DialogCourse from "./dialogs/DialogCourse";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function CourseLimitCTA() {
  const { canCreateCourse } = useSubscriptionAccess()
  const { data: creatorSubscriptionAccess } = canCreateCourse
  return (
    <div className="flex flex-col w-full justify-center gap-y-4 py-4 text-center">
      {creatorSubscriptionAccess && ((creatorSubscriptionAccess.limit ?? 1) > (creatorSubscriptionAccess.current ?? 0)) ? (
        <>
          <DialogCourse />
          <h2>You can create a new course (limit: {creatorSubscriptionAccess.limit ?? 1})</h2>
        </>
      ) : (
        <>
          <h2>You have reached the limit. Subscribe to create more courses.</h2>
          <Link href="/pricing">
            <Button>Upgrade Subscription</Button>
          </Link>
        </>
      )}
    </div>
  )
}
