import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { db } from "../src/server/db";
import dotenv from "dotenv";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

async function cleanupStripeData() {
  console.log('🧹 Starting Stripe data cleanup...');

  try {
    await db.$transaction(async (tx) => {
      // Delete in order to respect foreign key constraints
      console.log('Deleting subscriptions...');
      const deletedSubscriptions = await tx.subscription.deleteMany({});
      console.log(`Deleted ${deletedSubscriptions.count} subscriptions`);

      console.log('Deleting prices...');
      const deletedPrices = await tx.price.deleteMany({});
      console.log(`Deleted ${deletedPrices.count} prices`);

      console.log('Deleting features...');
      const deletedFeatures = await tx.feature.deleteMany({});
      console.log(`Deleted ${deletedFeatures.count} features`);

      console.log('Deleting products...');
      const deletedProducts = await tx.product.deleteMany({});
      console.log(`Deleted ${deletedProducts.count} products`);
    });

    console.log('✅ Cleanup complete');
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    throw error;
  }
}

cleanupStripeData()
  .catch(console.error)
  .finally(() => process.exit());
