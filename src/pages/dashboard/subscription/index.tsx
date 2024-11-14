import { Button } from "~/components/ui/button";
import ProfileLayout from "~/ui/dashboard/layout/ProfileLayout";
import PlaceholderComponent from "~/ui/prototype/PlaceholderComponent";


export default function SubscriptionPage() {
  return (
    <ProfileLayout>
      <PlaceholderComponent name="now you have a subscription">
        <div>
          <h1>Your account</h1>
          <Button>Upgrade</Button>
          <p>Billing details: on Stripe use a component</p>
        </div>
      </PlaceholderComponent>

    </ProfileLayout>
  );
}
