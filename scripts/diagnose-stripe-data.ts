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

async function diagnoseStripeData() {
  console.log('🔍 Starting Stripe integration diagnosis...\n');

  // Check for Products without Features
  const productsWithoutFeatures = await db.product.findMany({
    where: {
      additionalFeatures: {
        none: {}
      }
    },
    select: {
      id: true,
      name: true
    }
  });
  console.log('Products without features:', productsWithoutFeatures.length);
  if (productsWithoutFeatures.length > 0) {
    console.log(productsWithoutFeatures);
  }

  // Check for orphaned prices (where product doesn't exist)
  const orphanedPrices = await db.price.findMany({
    where: {
      productId: {
        not: { in: await db.product.findMany({ select: { id: true } }).then(products => products.map(p => p.id)) }
      }
    },
    select: {
      id: true,
      productId: true,
      description: true,
      currency: true,
      unitAmount: true
    }
  });
  console.log('\nOrphaned Prices:', orphanedPrices.length);
  if (orphanedPrices.length > 0) {
    console.log(orphanedPrices);
  }

  // Check for invalid subscriptions
  const invalidSubscriptions = await db.subscription.findMany({
    where: {
      OR: [
        {
          productId: {
            not: { in: await db.product.findMany({ select: { id: true } }).then(products => products.map(p => p.id)) }
          }
        },
        {
          priceId: {
            not: { in: await db.price.findMany({ select: { id: true } }).then(prices => prices.map(p => p.id)) }
          }
        },
        {
          userId: {
            not: { in: await db.user.findMany({ select: { id: true } }).then(users => users.map(u => u.id)) }
          }
        }
      ]
    },
    select: {
      id: true,
      userId: true,
      priceId: true,
      productId: true,
      status: true,
      currentPeriodEnd: true
    }
  });


  console.log('\nInvalid Subscriptions:', invalidSubscriptions.length);
  if (invalidSubscriptions.length > 0) {
    console.log(invalidSubscriptions);
  }

  // Check for features not associated with any product
  const unusedFeatures = await db.feature.findMany({
    where: {
      products: {
        none: {}
      }
    }
  });
  console.log('\nUnused Features:', unusedFeatures.length);
  if (unusedFeatures.length > 0) {
    console.log(unusedFeatures);
  }

  // Check for expired subscriptions that haven't been updated
  const expiredSubscriptions = await db.subscription.findMany({
    where: {
      currentPeriodEnd: {
        lt: new Date()
      },
      status: 'active'
    },
    include: {
      user: {
        select: {
          email: true
        }
      }
    }
  });
  console.log('\nExpired Active Subscriptions:', expiredSubscriptions.length);
  if (expiredSubscriptions.length > 0) {
    console.log(expiredSubscriptions);
  }

  // Verify Stripe data consistency
  console.log('\nVerifying Stripe data consistency...');
  const localProducts = await db.product.findMany({
    where: { active: true },
    include: {
      additionalFeatures: true
    }
  });

  const productMismatches = [];
  for (const localProduct of localProducts) {
    try {
      const stripeProduct = await stripe.products.retrieve(localProduct.id);
      if (!stripeProduct.active) {
        productMismatches.push({
          id: localProduct.id,
          error: 'Product active in DB but inactive in Stripe'
        });
      }
    } catch (error) {
      productMismatches.push({
        id: localProduct.id,
        error: 'Product not found in Stripe'
      });
    }
  }

  console.log('\nProduct mismatches:', productMismatches.length);
  if (productMismatches.length > 0) {
    console.log(productMismatches);
  }
}

diagnoseStripeData()
  .then(() => console.log('\n✅ Diagnosis complete'))
  .catch(console.error)
  .finally(() => process.exit());
