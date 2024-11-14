import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
      const contributor = await ctx.db.contributor.findUnique({
        where: { id: input.contributorId },
        select: { Treasury: true },
      });
      if (!contributor) {
        throw new Error("Contributor not found");
      }
      return contributor.Treasury;
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
