import { Card } from "~/components/ui/card";
import { api } from "~/utils/api";

// pages/subscription/success.tsx
const SubscriptionSuccess = () => {
  // Poll until status changes from incomplete to active
  const { data: subscription, isLoading } = api.billing.getCurrentSubscription.useQuery(
    undefined,
    {
      refetchInterval: (data) => {
        // Keep polling if:
        // - No data yet, or
        // - Status is incomplete
        // Stop polling once active or after max attempts
        if (!data || data.status === 'incomplete') {
          return 2000; // Poll every 2 seconds
        }
        return false; // Stop polling
      },
    }
  );

  if (isLoading || !subscription) {
    return (
      <Card className="text-center p-8">
        <h1>Setting up your subscription...</h1>
        <p>This will only take a moment</p>
      </Card>
    );
  }

  if (subscription.status === 'incomplete') {
    return (
      <Card className="text-center p-8">
        <h1>Confirming your payment...</h1>
        <p>Please wait while we confirm your payment</p>
      </Card>
    );
  }

  if (subscription.status === 'active') {
    return (
      <Card className="text-center p-8">
        <h1>Welcome to {subscription.product.name}!</h1>
        <p>Your subscription is now active</p>
        {/* Add CTAs to start using features */}
      </Card>
    );
  }

  // Handle other potential states
  return (
    <Card className="text-center p-8">
      <h1>Subscription Status: {subscription.status}</h1>
      <p>If you need help, please contact support</p>
    </Card>
  );
};

export default SubscriptionSuccess;
