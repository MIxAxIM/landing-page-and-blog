import { z } from "zod";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { stripe } from "~/config/stripe";

export const stripeRouter = createTRPCRouter({
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
        successUrl: z.string().url(),
        cancelUrl: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;

      try {
        // Get or create Stripe customer
        let customerId = user.stripeCustomerId;

        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email!,
            metadata: {
              userId: user.id,
            },
          });

          customerId = customer.id;

          // Update user with Stripe customer ID
          await ctx.db.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: customerId },
          });
        }

        // Create checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: "subscription",
          line_items: [
            {
              price: input.priceId,
              quantity: 1,
            },
          ],
          success_url: input.successUrl,
          cancel_url: input.cancelUrl,
          subscription_data: {
            metadata: {
              userId: user.id,
            },
          },
        });

        return { checkoutUrl: checkoutSession.url };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
          cause: error,
        });
      }
    }),

  createPortalSession: protectedProcedure
    .input(z.object({ returnUrl: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;

      if (!user.stripeCustomerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No Stripe customer found",
        });
      }

      try {
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: user.stripeCustomerId,
          return_url: input.returnUrl,
        });

        return { portalUrl: portalSession.url };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create portal session",
          cause: error,
        });
      }
    }),

  getSubscription: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session;

    try {
      const subscription = await ctx.db.subscription.findUnique({
        where: { userId: user.id },
        include: {
          product: true,
          price: true,
        },
      });

      return subscription;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch subscription",
        cause: error,
      });
    }
  }),
});
