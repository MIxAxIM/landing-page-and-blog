
import { Button } from "~/components/ui/button";
import ProfileLayout from "~/ui/dashboard/layout/ProfileLayout";
import PlaceholderComponent from "~/ui/prototype/PlaceholderComponent";


export default function ProfilePage() {
  return (
    <ProfileLayout>
      <PlaceholderComponent name="Here is your profile">
        <div>
          <h1>Your Profile</h1>
          <Button>Disconnect Discord Account?</Button>
          <p>We pull the following data from your Discord account to represent you on Andamio:</p>
        </div>
      </PlaceholderComponent>

    </ProfileLayout>
  );
}
