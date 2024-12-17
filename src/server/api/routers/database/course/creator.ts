import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const creatorRouter = createTRPCRouter({
  getCreatorByUser: publicProcedure
    .input(z.object({ userId: z.string().min(3) }))
    .query(({ ctx, input }) => {
      const user = ctx.db.creator.findFirst({
        where: {
          user: {
            id: input.userId,
          },
        },
      });

      return user;
    }),

  getCreatedCourses: publicProcedure
    .input(z.object({ creatorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const creator = await ctx.db.creator.findUnique({
        where: { id: input.creatorId },
        include: {
          courses: {
            include: {
              modules: true,
              variants: true,
            },
          },
        },
      });

      if (!creator) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Creator not found",
        });
      }

      return creator.courses;
    }),

  getContributedCourses: publicProcedure
    .input(z.object({ creatorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const creator = await ctx.db.creator.findUnique({
        where: { id: input.creatorId },
        include: {
          contributorCourses: {
            include: {
              modules: true,
              variants: true,
            },
          },
        },
      });

      if (!creator) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Creator not found",
        });
      }

      return creator.contributorCourses;
    }),

  create: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.creator.create({
        data: {
          user: { connect: { id: input.userId } },
        },
      });
    }),

  updateOnboardingStatus: protectedProcedure
    .input(
      z.object({
        creatorId: z.string().min(1),
        onboardingStatus: z.enum(["NOT_STARTED", "SKIPPED", "PARTIAL", "COMPLETE"]),
        onboardingCompletedAt: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.creator.update({
        where: { id: input.creatorId },
        data: {
          onboardingStatus: input.onboardingStatus,
          onboardingCompletedAt: input.onboardingCompletedAt,
        },
      });
    }),
});
