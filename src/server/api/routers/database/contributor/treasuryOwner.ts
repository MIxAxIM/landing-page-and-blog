import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const treasuryOwnerRouter = createTRPCRouter({
  getTreasuryOwnerByUser: publicProcedure
    .input(z.object({ userId: z.string().min(3) }))
    .query(({ ctx, input }) => {
      const user = ctx.db.treasuryOwner.findFirst({
        where: {
          user: {
            id: input.userId,
          },
        },
      });

      return user;
    }),

  create: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.treasuryOwner.create({
        data: {
          user: { connect: { id: input.userId } },
        },
      });
    }),

  getTreasuryOwnerTreasuries: publicProcedure
    .input(z.object({ treasuryOwnerId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const treasuryOwner = await ctx.db.treasuryOwner.findUnique({
        where: { id: input.treasuryOwnerId },
        select: { treasuries: true },
      });
      if (!treasuryOwner) {
        throw new Error("Treasury Owner not found");
      }
      return treasuryOwner.treasuries;
    }),

  updateOnboardingStatus: protectedProcedure
    .input(
      z.object({
        treasuryOwnerId: z.string().min(1),
        onboardingStatus: z.enum(["NOT_STARTED", "SKIPPED", "PARTIAL", "COMPLETE"]),
        onboardingCompletedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.treasuryOwner.update({
        where: { id: input.treasuryOwnerId },
        data: {
          onboardingStatus: input.onboardingStatus,
          onboardingCompletedAt: input.onboardingCompletedAt,
        },
      });
    }),
});
