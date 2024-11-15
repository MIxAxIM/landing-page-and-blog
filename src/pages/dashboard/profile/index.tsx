
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { useRoles } from "~/hooks/app/useRoles";
import { useSubscriptionAccess } from "~/hooks/app/useSubscriptionAccess";
import ProfileLayout from "~/ui/dashboard/layout/ProfileLayout";
import PlaceholderComponent from "~/ui/prototype/PlaceholderComponent";


export default function ProfilePage() {
  const { canCreateCourse, canCreateTreasury, canPublishContent } = useSubscriptionAccess();
  const { getCreator, getLearner, getContributor, getContributionManager, getTreasuryOwner } = useRoles()
  const { data: sessionData } = useSession()


  const { data: creatorStatus } = getCreator()
  const { data: learnerStatus } = getLearner()
  const { data: contributorStatus } = getContributor()
  const { data: contributionManagerStatus } = getContributionManager()
  const { data: treasuryOwnerStatus } = getTreasuryOwner()
  return (
    <ProfileLayout>
      <div className="max-w-7xl mx-auto my-12">

        <PlaceholderComponent name="Here is your profile">
          <div>
            <h1>Your Profile</h1>
            <Button>Disconnect Discord Account?</Button>
            <p>We pull the following data from your Discord account to represent you on Andamio:</p>

            <pre>{JSON.stringify(sessionData?.user, null, 2)}</pre>

          </div>
        </PlaceholderComponent>
        <div className="my-12 p-2 text-xs bg-primary text-primary-foreground">
          <h2>Teacher Status</h2>
          <pre>{JSON.stringify(creatorStatus, null, 2)}</pre>

          <h2>Learner Status</h2>
          <pre>{JSON.stringify(learnerStatus, null, 2)}</pre>
          <h2>Contributor Status</h2>
          <pre>{JSON.stringify(contributorStatus, null, 2)}</pre>
          <h2>Organizer Status</h2>
          <pre>{JSON.stringify(contributionManagerStatus, null, 2)}</pre>
          <h2>Treasury Owner Status</h2>
          <pre>{JSON.stringify(treasuryOwnerStatus, null, 2)}</pre>
          <h2>Subscription Access</h2>
          <pre>Can create course: {JSON.stringify(canCreateCourse.data, null, 2)}</pre>
          <pre>Can create treasury: {JSON.stringify(canCreateTreasury.data, null, 2)}</pre>
          <pre>Can publish content: {JSON.stringify(canPublishContent.data, null, 2)}</pre>
        </div>
      </div>

    </ProfileLayout>
  );
}
