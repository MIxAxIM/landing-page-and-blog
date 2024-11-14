import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useRoles } from "~/hooks/app/useRoles";

// TODO: Build a user journey from first login to Course Contributor status
export default function OnboardLearner() {

  const { enableLearner, sessionData } = useRoles()

  return (
    <div className="flex flex-col w-full bg-accent p-5 rounded-sm">
      <h1>Learn on Andamio</h1>
      {!!sessionData?.user.learnerId ? (
        <Link href="/studio">
          Start Learning
        </Link>
      ) : (
        <Button onClick={enableLearner}>Start onboarding as a Learner</Button>
      )}
    </div>
  );
}
