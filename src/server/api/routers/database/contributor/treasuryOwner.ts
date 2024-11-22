import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const calculateTotalTreasuryAda = (escrows: { tasks: { lovelace: string }[] }[]) => {
  return escrows.reduce((sum, escrow) => {
    return sum + escrow.tasks.reduce((taskSum, task) => {
      return taskSum + parseInt(task.lovelace) / 1_000_000;
    }, 0);
  }, 0);
};

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
      const treasuries = await ctx.db.treasury.findMany({
        where: { treasuryOwnerId: input.treasuryOwnerId },
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
