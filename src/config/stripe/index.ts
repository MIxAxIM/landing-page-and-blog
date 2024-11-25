
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Define the version of the Stripe API you want to use
  apiVersion: '2024-11-20.acacia',
  // Optional but recommended for better error logging
  appInfo: {
    name: 'AndamioPlatform',
    version: '0.1.0'
  },
});
