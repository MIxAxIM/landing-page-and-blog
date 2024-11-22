import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { calculateTotalTreasuryAda } from "./treasuryOwner";

export const contributorRouter = createTRPCRouter({
  getContributorByUser: publicProcedure
    .input(z.object({ userId: z.string().min(3) }))
    .query(({ ctx, input }) => {
      const user = ctx.db.contributor.findFirst({
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
      return ctx.db.contributor.create({
        data: {
          user: { connect: { id: input.userId } },
        },
      });
    }),

  getContributorTreasuries: publicProcedure
    .input(z.object({ contributorId: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const treasuries = await ctx.db.treasury.findMany({
        where: { id: input.contributorId },
        include: {
          _count: {
            select: { escrows: true }
          },
          escrows: { include: { tasks: true } },
        }
      });

      return treasuries.map(treasury => ({
        ...treasury,
        totalAda: calculateTotalTreasuryAda(treasury.escrows),
        totalTasks: treasury.escrows.reduce((sum, e) => sum + e.tasks.length, 0),
        escrowIds: treasury.escrows.map(e => e.id)
      }));
    }),

  updateOnboardingStatus: protectedProcedure
    .input(
      z.object({
        contributorId: z.string().min(1),
        onboardingStatus: z.enum(["NOT_STARTED", "SKIPPED", "PARTIAL", "COMPLETE"]),
        onboardingCompletedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.contributor.update({
        where: { id: input.contributorId },
        data: {
          onboardingStatus: input.onboardingStatus,
          onboardingCompletedAt: input.onboardingCompletedAt,
        },
      });
    }),
});
