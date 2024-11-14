import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const contributionManagerRouter = createTRPCRouter({
  getContributionManagerByUser: publicProcedure
    .input(z.object({ userId: z.string().min(3) }))
    .query(({ ctx, input }) => {
      const user = ctx.db.contributionManager.findFirst({
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
      return ctx.db.contributionManager.create({
        data: {
          user: { connect: { id: input.userId } },
        },
      });
    }),

  getContributionManagerTreasuries: publicProcedure
    .input(z.object({ contributionManagerId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const contributionManager = await ctx.db.contributionManager.findUnique({
        where: { id: input.contributionManagerId },
        select: { treasuries: true },
      });
      if (!contributionManager) {
        throw new Error("Contribution Manager not found");
      }
      return contributionManager.treasuries;
    }),

  updateOnboardingStatus: protectedProcedure
    .input(
      z.object({
        contributionManagerId: z.string().min(1),
        onboardingStatus: z.enum(["NOT_STARTED", "SKIPPED", "PARTIAL", "COMPLETE"]),
        onboardingCompletedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.contributionManager.update({
        where: { id: input.contributionManagerId },
        data: {
          onboardingStatus: input.onboardingStatus,
          onboardingCompletedAt: input.onboardingCompletedAt,
        },
      });
    }),
});
