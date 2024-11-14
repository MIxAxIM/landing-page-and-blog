import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useRoles } from "~/hooks/app/useRoles";

// TODO: Build a user journey from first login to Course Contributor status
export default function OnboardContributor() {

  const { enableContributor, sessionData } = useRoles()

  return (
    <div className="flex flex-col w-full bg-accent p-5 rounded-sm">
      <h1>{sessionData?.user.contributorId ? "Current" : "Add"} Contributor</h1>
      {!!sessionData?.user.contributorId ? (
        <Link href="/app/contribute">
          <Button>Open App</Button>
        </Link>
      ) : (
        <Button onClick={enableContributor}>Be a Contributor</Button>
      )}
    </div>
  );
}
