import Link from "next/link";
import { Button } from "~/components/ui/button";
import { useRoles } from "~/hooks/app/useRoles";

// TODO: Build a user journey from first login to Course Creator status
export default function OnboardCreator() {

  const { enableCreator, sessionData } = useRoles()

  return (
    <div className="flex flex-col w-full bg-accent p-5 rounded-sm">
      <h1>Teacher Onboarding</h1>
      {!!sessionData?.user.creatorId ? (
        <Link href="/studio">
          You&apos;re a Teacher - go build a Course!
        </Link>
      ) : (
        <Button onClick={enableCreator}>Teach on Andamio</Button>
      )}
    </div>
  );
}



