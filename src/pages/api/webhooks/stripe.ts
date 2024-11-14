import { buffer } from "micro";
import { type NextApiRequest, type NextApiResponse } from "next";
import { stripe } from "~/config/stripe";
import type Stripe from "stripe";
import { db } from "~/server/db";
import { Prisma } from "@prisma/client";

// Disable body parsing, need the raw body for webhook signature verification
export const config = {
	api: {
		bodyParser: false,
	},
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Type guards for event types
function isSubscriptionEvent(event: Stripe.Event): event is Stripe.Event & {
	data: { object: Stripe.Subscription }
} {
	return event.type.startsWith('customer.subscription.');
}

// Subscription handlers
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
	return db.$transaction(async (tx) => {
		const customerId = subscription.customer as string;
		const user = await tx.user.findFirst({
			where: { stripeCustomerId: customerId },
		});

		if (!user) {
			throw new Error(`No user found for Stripe customer ID: ${customerId}`);
		}

		// Get the price and product details
		const priceId = subscription.items.data[0]?.price.id ?? "";
		const productId = subscription.items.data[0]?.price.product as string;

		await tx.subscription.create({
			data: {
				id: subscription.id,
				userId: user.id,
				status: subscription.status,
				priceId,
				productId,
				currentPeriodStart: new Date(subscription.current_period_start * 1000),
				currentPeriodEnd: new Date(subscription.current_period_end * 1000),
				cancelAtPeriodEnd: subscription.cancel_at_period_end,
			},
		});

		// Update user's subscription status
		await tx.user.update({
			where: { id: user.id },
			data: {
				stripeSubscriptionId: subscription.id,
				stripeSubscriptionStatus: subscription.status,
			},
		});
	});
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
	return db.$transaction(async (tx) => {
		await tx.subscription.update({
			where: { id: subscription.id },
			data: {
				status: subscription.status,
				currentPeriodStart: new Date(subscription.current_period_start * 1000),
				currentPeriodEnd: new Date(subscription.current_period_end * 1000),
				cancelAtPeriodEnd: subscription.cancel_at_period_end,
			},
		});

		const sub = await tx.subscription.findUnique({
			where: { id: subscription.id },
			select: { userId: true },
		});

		if (sub) {
			await tx.user.update({
				where: { id: sub.userId },
				data: {
					stripeSubscriptionStatus: subscription.status,
				},
			});
		}
	});
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
	return db.$transaction(async (tx) => {
		const sub = await tx.subscription.findUnique({
			where: { id: subscription.id },
			select: { userId: true },
		});

		await tx.subscription.delete({
			where: { id: subscription.id },
		});

		if (sub) {
			await tx.user.update({
				where: { id: sub.userId },
				data: {
					stripeSubscriptionId: null,
					stripeSubscriptionStatus: null,
				},
			});
		}
	});
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).json({ message: "Method not allowed" });
	}

	if (!webhookSecret) {
		return res.status(500).json({ message: "Webhook secret not configured" });
	}

	try {
		const buf = await buffer(req);
		const sig = req.headers["stripe-signature"];

		if (!sig) {
			return res.status(400).json({ message: "No signature provided" });
		}

		const event = stripe.webhooks.constructEvent(
			buf,
			sig,
			webhookSecret
		);

		// Check for duplicate events
		const existingEvent = await db.stripeEvent.findUnique({
			where: { id: event.id },
		});

		if (existingEvent) {
			return res.json({ received: true });
		}

		// Store the event in the database
		await db.stripeEvent.create({
			data: {
				id: event.id,
				type: event.type,
				object: event.object,
				api_version: event.api_version,
				account: event.account,
				created: new Date(event.created * 1000),
				data: event.data.object as unknown as Prisma.InputJsonValue,
				livemode: event.livemode,
				pending_webhooks: event.pending_webhooks,
				request: (event.request ?? {}) as unknown as Prisma.InputJsonValue,
			},
		});

		// Process the event
		try {
			if (isSubscriptionEvent(event)) {
				switch (event.type) {
					case "customer.subscription.created":
						await handleSubscriptionCreated(event.data.object);
						break;
					case "customer.subscription.updated":
						await handleSubscriptionUpdated(event.data.object);
						break;
					case "customer.subscription.deleted":
						await handleSubscriptionDeleted(event.data.object);
						break;
				}
			}
			// Add handlers for other event types here
		} catch (processError) {
			// Log the error but don't return an error response
			// This prevents Stripe from retrying webhooks that we've already stored
			console.error("Error processing webhook:", processError);
		}

		return res.json({ received: true });
	} catch (err) {
		// Handle webhook verification errors
		if (err instanceof stripe.errors.StripeSignatureVerificationError) {
			return res.status(400).json({
				message: "Invalid signature",
				error: err.message
			});
		}

		// Handle all other errors
		console.error("Critical webhook error:", err);
		return res.status(500).json({
			message: "Internal server error",
			error: err instanceof Error ? err.message : "Unknown error"
		});
	}
}
