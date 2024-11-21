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
  courseRequirements: z
    .array(
      z.object({
        courseCode: z.string().min(1, "Course is required"),
        requiredModules: z
          .array(z.string())
          .min(1, "At least one module is required"),
      }),
    )
    .min(1, "At least one course requirement is needed"),
});

const updatePrerequisiteSchema = z.object({
  id: z.string().min(1),

  contributorPolicyId: z.string().min(1),
  title: z.string().optional(),
  courseRequirements: z
    .array(
      z.object({
        id: z.string().optional(), // Optional for new requirements
        courseCode: z.string().min(1, "Course is required"),
        requiredModules: z
          .array(z.string())
          .min(1, "At least one module is required"),
      }),
    )
    .min(1, "At least one course requirement is needed"),
});

export const contributorPrerequisiteRouter = createTRPCRouter({
  // Public procedures
  getPrerequisites: publicProcedure.query(({ ctx }) => {
    return ctx.db.contributorPrerequisite.findMany({
      include: {
        courseRequirements: {
          include: {
            course: {
              select: {
                id: true,
                courseCode: true,
                title: true,
              },
              include: {
                onchainInstance: {
                  select: {
                    CourseCreatorNFTPolicyID: true,
                  }
                },
              },
            },
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
          courseRequirements: {
            include: {
              course: {
                select: {
                  id: true,
                  courseCode: true,
                  title: true,
                },
                include: {
                  onchainInstance: {
                    select: {
                      CourseCreatorNFTPolicyID: true,
                    }
                  },
                },
              },
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
        where: {
          courseRequirements: {
            some: {
              courseCode: input,
            },
          },
        },
        include: {
          courseRequirements: {
            include: {
              course: {
                select: {
                  id: true,
                  courseCode: true,
                  title: true,
                },
                include: {
                  onchainInstance: {
                    select: {
                      CourseCreatorNFTPolicyID: true,
                    }
                  },
                },
              },
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
      // Verify all courses exist first
      for (const req of input.courseRequirements) {
        const course = await ctx.db.course.findFirst({
          where: { courseCode: req.courseCode },
        });

        if (!course) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Course ${req.courseCode} not found`,
          });
        }
      }

      return ctx.db.contributorPrerequisite.create({
        data: {
          contributorPolicyId: input.contributorPolicyId,
          title: input.title,
          courseRequirements: {
            create: input.courseRequirements.map((req) => ({
              courseCode: req.courseCode,
              requiredModules: req.requiredModules,
            })),
          },
        },
        include: {
          courseRequirements: {
            include: {
              course: {
                select: {
                  id: true,
                  courseCode: true,
                  title: true,
                },
              },
            },
          },
        },
      });
    }),

  updatePrerequisite: protectedProcedure
    .input(updatePrerequisiteSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify all courses exist
      for (const req of input.courseRequirements) {
        const course = await ctx.db.course.findFirst({
          where: { courseCode: req.courseCode },
        });

        if (!course) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Course ${req.courseCode} not found`,
          });
        }
      }

      // Start a transaction to handle the update
      return ctx.db.$transaction(async (tx) => {
        // Delete any requirements that aren't in the new list
        await tx.courseRequirement.deleteMany({
          where: {
            prerequisiteId: input.id,
            id: {
              notIn: input.courseRequirements
                .map((req) => req.id)
                .filter((id): id is string => id !== undefined),
            },
          },
        });

        // Update existing requirements and create new ones
        const prerequisite = await tx.contributorPrerequisite.update({
          where: { id: input.id },
          data: {
            title: input.title,
            courseRequirements: {
              upsert: input.courseRequirements.map((req) => ({
                where: {
                  id: req.id ?? "",
                },
                create: {
                  courseCode: req.courseCode,
                  requiredModules: req.requiredModules,
                },
                update: {
                  courseCode: req.courseCode,
                  requiredModules: req.requiredModules,
                },
              })),
            },
          },
          include: {
            courseRequirements: {
              include: {
                course: {
                  select: {
                    id: true,
                    courseCode: true,
                    title: true,
                  },
                },
              },
            },
          },
        });

        return prerequisite;
      });
    }),

  deletePrerequisite: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      return ctx.db.$transaction(async (tx) => {
        // Delete all course requirements
        await tx.courseRequirement.deleteMany({
          where: { prerequisiteId: input },
        });

        // Delete the prerequisite
        return tx.contributorPrerequisite.delete({
          where: { id: input },
        });
      });
    }),
});
