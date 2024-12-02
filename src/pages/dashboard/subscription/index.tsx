import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import ProfileLayout from "~/components/layout/ProfileLayout";
import LoadingCircle from "~/ui/studio/components/ContentEditor/ui/icons/loading-circle";
import { api } from "~/utils/api";


export default function SubscriptionPage() {
  const { data: subscription, isLoading } = api.billing.getCurrentSubscription.useQuery()
  if (isLoading) return <LoadingCircle />
  return (
    <ProfileLayout>
      {!!subscription ? (
        <>
          <Card className="p-8 text-left">
            <h1>You have a subscription to Andamio {subscription?.product.name}!</h1>
            {/* Add CTAs to start using features */}
            <p className="prose">Price: ${((subscription?.price.unitAmount ?? 0n) / 100n).toString()} / {subscription?.price.interval}</p>
            <p className="prose">Status: {subscription?.status}</p>
            <p className="prose">Created: {subscription?.created.toLocaleDateString()}</p>
            <p className="prose">Subscription Expires: {subscription?.currentPeriodEnd.toLocaleDateString()}</p>
          </Card>
          <Link href="/pricing">
            <Button>Upgrade</Button>
          </Link>
        </>

      ) : (
        <>
          <Card className="p-8 text-left">
            <h1>Want to get more out of Andamio?</h1>
            {/* Add CTAs to start using features */}
          </Card>
          <Link href="/pricing">
            <Button>View Pricing</Button>
          </Link>
        </>
      )}

    </ProfileLayout>
  );
}
