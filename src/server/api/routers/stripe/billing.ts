import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { stripe } from "~/config/stripe";

export const billingRouter = createTRPCRouter({
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    const subscription = await ctx.db.subscription.findUnique({
      where: { userId: ctx.session.user.id },
      include: {
        product: {
          include: {
            additionalFeatures: true,
            prices: {
              where: { active: true },
            },
          },
        },
        price: true,
      },
    });

    return subscription;
  }),

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

        const checkoutSession = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: "subscription",
          line_items: [{ price: input.priceId, quantity: 1 }],
          success_url: input.successUrl,
          cancel_url: input.cancelUrl,
          subscription_data: {
            metadata: {
              userId: user.id,
            },
          },
        });

        return { url: checkoutSession.url };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
    }),

  getPlans: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.product.findMany({
      where: { active: true },
      include: {
        prices: {
          where: { active: true },
        },
        additionalFeatures: true,
      },
    });
  }),

  createCustomerPortal: protectedProcedure
    .input(z.object({ returnUrl: z.string().url() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx.session;

      if (!user.stripeCustomerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No billing account found",
        });
      }

      try {
        const portalSession = await stripe.billingPortal.sessions.create({
          customer: user.stripeCustomerId,
          return_url: input.returnUrl,
        });

        return { url: portalSession.url };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create customer portal session",
        });
      }
    }),

  checkAccess: protectedProcedure
    .input(
      z.object({
        feature: z.enum([
          "CREATE_COURSE",
          "CREATE_TREASURY",
          "PUBLISH_CONTENT",
          "CUSTOM_DOMAIN",
        ]),
      })
    )
    .query(async ({ ctx, input }) => {
      const subscription = await ctx.db.subscription.findUnique({
        where: { userId: ctx.session.user.id },
        include: {
          product: true,
        },
      });

      if (!subscription || subscription.status !== "active") {
        return {
          hasAccess: false,
          reason: "No active subscription",
        };
      }

      const { product } = subscription;

      switch (input.feature) {
        case "CREATE_COURSE":
          const courseCount = await ctx.db.course.count({
            where: { createdById: ctx.session.user.creatorId },
          });
          return {
            hasAccess: courseCount < product.maxAllowedCourses,
            reason: courseCount >= product.maxAllowedCourses
              ? `Limited to ${product.maxAllowedCourses} courses in current plan`
              : null,
            limit: product.maxAllowedCourses,
            current: courseCount,
          };

        case "CREATE_TREASURY":
          const treasuryCount = await ctx.db.treasury.count({
            where: { treasuryOwnerId: ctx.session.user.id },
          });
          return {
            hasAccess: treasuryCount < product.maxAllowedTreasuries,
            reason: treasuryCount >= product.maxAllowedTreasuries
              ? `Limited to ${product.maxAllowedTreasuries} treasuries in current plan`
              : null,
            limit: product.maxAllowedTreasuries,
            current: treasuryCount,
          };

        case "PUBLISH_CONTENT":
          return {
            hasAccess: product.canPublish,
            reason: !product.canPublish
              ? "Publishing not available in current plan"
              : null,
          };

        // NOTE: Example of Custom Feature implemenation
        //case "CUSTOM_DOMAIN":
        //  const hasCustomDomainFeature = product.additionalFeatures.some(
        //    (f) => f.name === "custom_url_allowed" && f.value === "true"
        //  );
        //  return {
        //    hasAccess: hasCustomDomainFeature,
        //    reason: !hasCustomDomainFeature 
        //      ? "Custom domains not available in current plan"
        //      : null,
        //  };
      }
    }),
});
