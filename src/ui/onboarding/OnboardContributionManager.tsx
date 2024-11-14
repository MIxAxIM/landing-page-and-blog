import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useRoles } from "~/hooks/app/useRoles";

// TODO: Build a user journey from first login to Course Contributor status
export default function OnboardContributionManager() {

  const { enableContributionManager, sessionData } = useRoles()

  return (
    <div className="flex flex-col w-full bg-accent p-5 rounded-sm">
      <h1>Add Contribution Manager</h1>
      {!!sessionData?.user.contributionManagerId ? (
        <Link href="/studio">
          You are ready to help govern a treasury.
        </Link>
      ) : (
        <Button onClick={enableContributionManager}>Be a Contribution Manager</Button>
      )}
    </div>
  );
}
