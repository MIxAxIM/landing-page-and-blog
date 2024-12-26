
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { db } from "../src/server/db";
import Stripe from "stripe";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia'
});

async function populateFromStripe() {
  await db.$transaction(async (tx) => {
    // Clear existing data
    await tx.subscription.deleteMany({});
    await tx.price.deleteMany({});
    await tx.product.deleteMany({});

    // Get all Stripe data
    const products = await stripe.products.list({ active: true, limit: 100 });
    const prices = await stripe.prices.list({ active: true, limit: 100 });

    const subscriptions = await stripe.subscriptions.list({
      status: 'active',
      limit: 100,
      expand: ['data.customer']
    });

    // Create products
    for (const product of products.data) {
      await tx.product.create({
        data: {
          id: product.id,
          name: product.name,
          description: product.description ?? '',
          image: product.images[0] ?? '',
          active: product.active,
          maxAllowedCourses: parseInt(product.metadata.maxAllowedCourses ?? '1'),
          maxAllowedTreasuries: parseInt(product.metadata.maxAllowedTreasuries ?? '1'),
          treasuryDepositLimit: BigInt(product.metadata.treasuryDepositLimit ?? '0'),
          canPublish: product.metadata.canPublish === 'true',
          transactionFeeDiscount: parseInt(product.metadata.transactionFeeDiscount ?? '0')
        }
      });
    }

    // Create prices
    for (const price of prices.data) {
      await tx.price.create({
        data: {
          id: price.id,
          active: price.active,
          description: price.nickname ?? null,
          unitAmount: BigInt(price.unit_amount ?? 0),
          currency: price.currency,
          type: price.type,
          interval: price.recurring?.interval ?? 'month',
          intervalCount: price.recurring?.interval_count ?? 1,
          productId: price.product as string
        }
      });
    }

    // Create subscriptions
    for (const subscription of subscriptions.data) {
      const customer = subscription.customer as Stripe.Customer;
      const user = await tx.user.findFirst({
        where: { stripeCustomerId: customer.id }
      });

      if (!user) continue;

      const priceId = subscription.items.data[0]?.price.id;
      const productId = subscription.items.data[0]?.price.product as string;

      if (!priceId || !productId) continue;

      await tx.subscription.create({
        data: {
          id: subscription.id,
          userId: user.id,
          status: subscription.status,
          priceId,
          productId,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        }
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          stripeSubscriptionId: subscription.id,
          stripeSubscriptionStatus: subscription.status
        }
      });
    }
  });
}



populateFromStripe()
  .then(() => console.log('Database populated'))
  .catch(console.error)
  .finally(() => process.exit());
