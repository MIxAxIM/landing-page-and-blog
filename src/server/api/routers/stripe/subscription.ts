import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { stripe } from "~/config/stripe";

export const subscriptionRouter = createTRPCRouter({
  getCurrentSubscription: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const subscription = await ctx.db.subscription.findUnique({
        where: { userId: user.id },
        include: {
          product: {
            include: {
              additionalFeatures: true,
            },
          },
          price: true,
        },
      });

      return subscription;
    }),

  createCheckoutSession: protectedProcedure
    .input(z.object({
      priceId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { priceId } = input;

      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { subscriptions: true },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      let customerId = user.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email!,
          metadata: {
            userId: user.id,
          },
        });

        customerId = customer.id;

        await ctx.db.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId },
        });
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
        metadata: {
          userId: user.id,
        },
      });

      return { url: session.url };
    }),

  createPortalSession: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user?.stripeCustomerId) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Customer not found",
        });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
      });

      return { url: session.url };
    }),
});
