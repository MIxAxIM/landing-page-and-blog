import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { stripe } from "~/config/stripe";
import { type Prisma } from "@prisma/client";

// Input validation schemas
const createProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  image: z.string().url().optional(),
  maxAllowedCourses: z.number().int().positive(),
  maxAllowedTreasuries: z.number().int().positive(),
  treasuryDepositLimit: z.number().int().positive(),
  canPublish: z.boolean(),
  transactionFeeDiscount: z.number().int().min(0).max(100),
  additionalFeatures: z.array(z.object({
    name: z.string(),
    value: z.string(),
    description: z.string().optional(),
  })),
});

const createPriceSchema = z.object({
  productId: z.string(),
  unitAmount: z.string(),
  currency: z.string().default('usd'),
  recurring: z.object({
    interval: z.enum(['day', 'week', 'month', 'year']),
    intervalCount: z.string(),
  }),
  trialPeriodDays: z.string(),
});

const updateProductSchema = createProductSchema.partial().extend({
  id: z.string(),
});

const updatePriceSchema = z.object({
  id: z.string(),
  active: z.boolean(),
});

export const adminRouter = createTRPCRouter({
  // Create a new product in both Stripe and local database
  createProduct: protectedProcedure
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin (you'll need to implement this check)
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only administrators can manage products",
        });
      }

      try {
        // Create product in Stripe
        const stripeProduct = await stripe.products.create({
          name: input.name,
          description: input.description,
          images: input.image ? [input.image] : undefined,
          metadata: {
            maxAllowedCourses: input.maxAllowedCourses.toString(),
            maxAllowedTreasuries: input.maxAllowedTreasuries.toString(),
            treasuryDepositLimit: input.treasuryDepositLimit.toString(),
            canPublish: input.canPublish.toString(),
            transactionFeeDiscount: input.transactionFeeDiscount.toString(),
          },
        });

        // Create product in database using a transaction
        const product = await ctx.db.$transaction(async (tx) => {
          // Create the product
          const product = await tx.product.create({
            data: {
              id: stripeProduct.id,
              name: input.name,
              description: input.description,
              image: input.image ?? "",
              maxAllowedCourses: input.maxAllowedCourses,
              maxAllowedTreasuries: input.maxAllowedTreasuries,
              treasuryDepositLimit: BigInt(input.treasuryDepositLimit),
              canPublish: input.canPublish,
              transactionFeeDiscount: input.transactionFeeDiscount,
            },
          });

          // Create additional features
          if (input.additionalFeatures.length > 0) {
            await Promise.all(
              input.additionalFeatures.map((feature) =>
                tx.feature.create({
                  data: {
                    name: feature.name,
                    value: feature.value,
                    description: feature.description,
                    products: {
                      connect: { id: product.id },
                    },
                  },
                })
              )
            );
          }

          return product;
        });

        return product;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create product",
        });
      }
    }),

  // Create a new price for a product
  createPrice: protectedProcedure
    .input(createPriceSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only administrators can manage prices",
        });
      }

      try {
        // Create price in Stripe
        const stripePrice = await stripe.prices.create({
          product: input.productId,
          unit_amount: parseInt(input.unitAmount),
          currency: input.currency,
          recurring: {
            interval: input.recurring.interval,
            interval_count: parseInt(input.recurring.intervalCount),

            ...(input.trialPeriodDays && { trial_period_days: parseInt(input.trialPeriodDays) }),
          },
        });

        // Create price in database
        const price = await ctx.db.price.create({
          data: {
            id: stripePrice.id,
            productId: input.productId,
            active: true,
            unitAmount: BigInt(input.unitAmount),
            currency: input.currency,
            type: 'recurring',
            interval: input.recurring.interval,
            intervalCount: parseInt(input.recurring.intervalCount),
            trialPeriodDays: parseInt(input.trialPeriodDays ?? 0),
          },
        });

        return price;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to create price",
        });
      }
    }),

  // Update an existing product
  updateProduct: protectedProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only administrators can manage products",
        });
      }

      try {
        // Update product in Stripe
        await stripe.products.update(input.id, {
          name: input.name,
          description: input.description,
          images: input.image ? [input.image] : undefined,
          metadata: {
            ...(input.maxAllowedCourses && { maxAllowedCourses: input.maxAllowedCourses.toString() }),
            ...(input.maxAllowedTreasuries && { maxAllowedTreasuries: input.maxAllowedTreasuries.toString() }),
            ...(input.treasuryDepositLimit && { treasuryDepositLimit: input.treasuryDepositLimit.toString() }),
            ...(input.canPublish !== undefined && { canPublish: input.canPublish.toString() }),
            ...(input.transactionFeeDiscount && { transactionFeeDiscount: input.transactionFeeDiscount.toString() }),
          },
        });

        // Update product in database
        const updateData: Prisma.ProductUpdateInput = {
          ...(input.name && { name: input.name }),
          ...(input.description && { description: input.description }),
          ...(input.image && { image: input.image }),
          ...(input.maxAllowedCourses && { maxAllowedCourses: input.maxAllowedCourses }),
          ...(input.maxAllowedTreasuries && { maxAllowedTreasuries: input.maxAllowedTreasuries }),
          ...(input.treasuryDepositLimit && { treasuryDepositLimit: BigInt(input.treasuryDepositLimit) }),
          ...(input.canPublish !== undefined && { canPublish: input.canPublish }),
          ...(input.transactionFeeDiscount && { transactionFeeDiscount: input.transactionFeeDiscount }),
        };

        const product = await ctx.db.$transaction(async (tx) => {
          // Update the product
          const product = await tx.product.update({
            where: { id: input.id },
            data: updateData,
          });

          // Update additional features if provided
          if (input.additionalFeatures) {
            // Remove existing features
            await tx.feature.deleteMany({
              where: {
                products: {
                  some: { id: input.id },
                },
              },
            });

            // Create new features
            await Promise.all(
              input.additionalFeatures.map((feature) =>
                tx.feature.create({
                  data: {
                    name: feature.name,
                    value: feature.value,
                    description: feature.description,
                    products: {
                      connect: { id: product.id },
                    },
                  },
                })
              )
            );
          }

          return product;
        });

        return product;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to update product",
        });
      }
    }),

  // Update price status (active/inactive)
  updatePrice: protectedProcedure
    .input(updatePriceSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only administrators can manage prices",
        });
      }

      try {
        // Update price in Stripe
        await stripe.prices.update(input.id, {
          active: input.active,
        });

        // Update price in database
        const price = await ctx.db.price.update({
          where: { id: input.id },
          data: { active: input.active },
        });

        return price;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to update price",
        });
      }
    }),

  // Get all products with their prices
  getAllProducts: protectedProcedure
    .query(async ({ ctx }) => {
      if (!ctx.session.user.isAdmin) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only administrators can view all products",
        });
      }

      return ctx.db.product.findMany({
        include: {
          prices: true,
          additionalFeatures: true,
        },
      });
    }),
});
