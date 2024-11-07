import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const createPrerequisiteSchema = z.object({
  contributorPolicyId: z.string().min(1),
  title: z.string().optional(),
  courseCode: z.string().min(1),
  requiredCourseModules: z.array(z.string()).min(1),
});

const updatePrerequisiteSchema = z.object({
  contributorPolicyId: z.string().min(1),
  title: z.string().optional(),
  courseCode: z.string().min(1).optional(),
  requiredCourseModules: z.array(z.string()).optional(),
});

export const contributorPrerequisiteRouter = createTRPCRouter({
  // Public procedures
  getPrerequisites: publicProcedure.query(({ ctx }) => {
    return ctx.db.contributorPrerequisite.findMany({
      include: {
        course: {
          select: {
            id: true,
            courseCode: true,
            title: true,
          },
        },
        escrows: {
          select: {
            id: true,
            title: true,
            escrowNftPolicyId: true,
            isSyncedWithNetwork: true,
            savedAcceptanceCriteria: true,
            treasuryId: true,
          },
        },
      },
    });
  }),

  getPrerequisiteById: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.contributorPrerequisite.findUnique({
        where: { contributorPolicyId: input },
        include: {
          course: {
            select: {
              id: true,
              courseCode: true,
              title: true,
            },
          },
          escrows: {
            select: {
              id: true,
              title: true,
              escrowNftPolicyId: true,
              isSyncedWithNetwork: true,
              savedAcceptanceCriteria: true,
              treasuryId: true,
            },
          },
        },
      });
    }),

  getPrerequisitesByCourse: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.contributorPrerequisite.findMany({
        where: { courseCode: input },
        include: {
          course: {
            select: {
              id: true,
              courseCode: true,
              title: true,
            },
          },
          escrows: {
            select: {
              id: true,
              title: true,
              escrowNftPolicyId: true,
              isSyncedWithNetwork: true,
              savedAcceptanceCriteria: true,
              treasuryId: true,
            },
          },
        },
      });
    }),

  // Protected procedures

  createPrerequisite: protectedProcedure
    .input(createPrerequisiteSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify course exists first
      const course = await ctx.db.course.findFirst({
        where: { courseCode: input.courseCode },
      });

      console.log("Check111", course);

      if (!course) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Course not found",
        });
      }

      return ctx.db.contributorPrerequisite.create({
        data: {
          contributorPolicyId: input.contributorPolicyId,
          title: input.title,
          courseCode: course.courseCode,
          requiredCourseModules: input.requiredCourseModules,
        },
        include: {
          course: {
            select: {
              id: true,
              courseCode: true,
              title: true,
            },
          },
        },
      });
    }),

  updatePrerequisite: protectedProcedure
    .input(updatePrerequisiteSchema)
    .mutation(async ({ ctx, input }) => {
      const { contributorPolicyId, ...updateData } = input;

      // If courseCode is being updated, verify the new course exists
      if (updateData.courseCode) {
        const course = await ctx.db.course.findUnique({
          where: { courseCode: updateData.courseCode },
        });

        if (!course) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Course not found",
          });
        }
      }

      return ctx.db.contributorPrerequisite.update({
        where: { contributorPolicyId },
        data: updateData,
        include: {
          course: {
            select: {
              id: true,
              courseCode: true,
              title: true,
            },
          },
        },
      });
    }),

  deletePrerequisite: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Delete the prerequisite and all its relations in a transaction
      return ctx.db.$transaction(async (tx) => {
        // Delete all escrow relations first

        // Delete the prerequisite
        return tx.contributorPrerequisite.delete({
          where: { contributorPolicyId: input },
        });
      });
    }),
});
