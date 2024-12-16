import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { AssignmentNetworkStatus, AssignmentPrivateStatus } from "@prisma/client";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

// Helper function to validate network status transitions
const isValidNetworkStatusTransition = (
  currentStatus: AssignmentNetworkStatus,
  newStatus: AssignmentNetworkStatus,
) => {
  const allowedTransitions: Record<AssignmentNetworkStatus, AssignmentNetworkStatus[]> = {
    PENDING_TX_COMMITMENT_MADE: [
      AssignmentNetworkStatus.PENDING_TX_COMMITMENT_MADE,
      AssignmentNetworkStatus.PENDING_TX_ADD_INFO,
      AssignmentNetworkStatus.PENDING_APPROVAL,
    ],
    PENDING_TX_ADD_INFO: [AssignmentNetworkStatus.PENDING_APPROVAL],
    PENDING_APPROVAL: [
      AssignmentNetworkStatus.PENDING_TX_ASSIGNMENT_ACCEPTED,
      AssignmentNetworkStatus.PENDING_TX_ASSIGNMENT_DENIED
    ],
    PENDING_TX_ASSIGNMENT_ACCEPTED: [AssignmentNetworkStatus.ASSIGNMENT_ACCEPTED],
    ASSIGNMENT_ACCEPTED: [AssignmentNetworkStatus.PENDING_TX_CLAIM_CREDENTIAL],
    PENDING_TX_ASSIGNMENT_DENIED: [AssignmentNetworkStatus.ASSIGNMENT_DENIED],
    ASSIGNMENT_DENIED: [AssignmentNetworkStatus.PENDING_TX_ADD_INFO],
    PENDING_TX_CLAIM_CREDENTIAL: [AssignmentNetworkStatus.CREDENTIAL_CLAIMED],
    CREDENTIAL_CLAIMED: [],
  };

  return allowedTransitions[currentStatus].includes(newStatus);
};

export const assignmentCommitmentRouter = createTRPCRouter({
  // Public procedures
  getAssignmentCommitments: publicProcedure
    .input(
      z.object({
        assignmentId: z.string().optional(),
        learnerId: z.string().optional(),
        networkStatus: z.nativeEnum(AssignmentNetworkStatus).optional(),
        privateStatus: z.nativeEnum(AssignmentPrivateStatus).optional(),
      }).optional()
    )
    .query(({ ctx, input }) => {
      return ctx.db.assignmentCommitment.findMany({
        where: {
          ...(input?.assignmentId && { assignmentId: input.assignmentId }),
          ...(input?.learnerId && { learnerId: input.learnerId }),
          ...(input?.networkStatus && { networkStatus: input.networkStatus }),
          ...(input?.privateStatus && { privateStatus: input.privateStatus }),
        },
        include: {
          assignment: {
            include: {
              module: true,
            },
          },
          learner: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });
    }),

  getAssignmentCommitmentById: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.assignmentCommitment.findUnique({
        where: { id: input },
      });
    }),

  getAssignmentCommitmentsByCourse: publicProcedure
    .input(
      z.object({
        courseCode: z.string().min(1),
        learnerId: z.string().optional(),
        networkStatus: z.nativeEnum(AssignmentNetworkStatus).optional(),
        privateStatus: z.nativeEnum(AssignmentPrivateStatus).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.assignmentCommitment.findMany({
        where: {
          assignment: {
            module: {
              originalCourse: {
                courseCode: input.courseCode
              }
            }
          },
          ...(input.networkStatus && { networkStatus: input.networkStatus }),
          ...(input.privateStatus && { privateStatus: input.privateStatus }),
          ...(input.learnerId && { learnerId: input.learnerId }),
        },
        orderBy: { networkStatus: 'asc' },
      });
    }),


  getAssignmentCommitmentsByCourseModule: publicProcedure
    .input(
      z.object({
        courseCode: z.string().min(1),
        moduleCode: z.string().min(1),
        networkStatus: z.nativeEnum(AssignmentNetworkStatus).optional(),
        privateStatus: z.nativeEnum(AssignmentPrivateStatus).optional(),
        learnerId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.assignmentCommitment.findMany({
        where: {
          assignment: {
            module: {
              moduleCode: input.moduleCode,
              originalCourse: {
                courseCode: input.courseCode
              }
            }
          },
          ...(input.networkStatus && { networkStatus: input.networkStatus }),
          ...(input.privateStatus && { privateStatus: input.privateStatus }),
          ...(input.learnerId && { learnerId: input.learnerId }),
        },
        orderBy: { networkStatus: 'asc' },
      });
    }),

  // Protected procedures
  createAssignmentCommitment: protectedProcedure
    .input(
      z.object({
        assignmentId: z.string().min(1),
        learnerId: z.string().min(1),
        privateStatus: z.nativeEnum(AssignmentPrivateStatus).optional(),
        networkStatus: z.nativeEnum(AssignmentNetworkStatus).optional(),
        privateEvidence: z.object({}).passthrough().optional(),
        networkEvidence: z.object({}).passthrough().optional(),
        networkEvidenceHash: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingCommitment = await ctx.db.assignmentCommitment.findUnique({
        where: {
          assignmentId_learnerId: {
            assignmentId: input.assignmentId,
            learnerId: input.learnerId,
          },
        },
      });

      if (existingCommitment) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A commitment for this assignment already exists",
        });
      }

      return ctx.db.assignmentCommitment.create({
        data: input,
        include: {
          assignment: true,
          learner: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });
    }),

  updatePrivateEvidence: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        privateEvidence: z.object({}).passthrough(),
        privateStatus: z.nativeEnum(AssignmentPrivateStatus).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const existingCommitment = await ctx.db.assignmentCommitment.findUnique({
        where: { id },
      });

      if (!existingCommitment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignment commitment not found",
        });
      }

      return ctx.db.assignmentCommitment.update({
        where: { id },
        data: updateData
      });
    }),

  updateNetworkEvidence: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        networkEvidence: z.object({}).passthrough(),
        networkEvidenceHash: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const existingCommitment = await ctx.db.assignmentCommitment.findUnique({
        where: { id },
      });

      if (!existingCommitment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignment commitment not found",
        });
      }

      return ctx.db.assignmentCommitment.update({
        where: { id },
        data: updateData
      });
    }),

  updateNetworkStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        networkStatus: z.nativeEnum(AssignmentNetworkStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingCommitment = await ctx.db.assignmentCommitment.findUnique({
        where: { id: input.id },
      });

      if (!existingCommitment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignment commitment not found",
        });
      }

      if (!isValidNetworkStatusTransition(existingCommitment.networkStatus, input.networkStatus)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid status transition from ${existingCommitment.networkStatus} to ${input.networkStatus}`,
        });
      }

      return ctx.db.assignmentCommitment.update({
        where: { id: input.id },
        data: {
          networkStatus: input.networkStatus,
        },
      });
    }),

  updatePrivateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        privateStatus: z.nativeEnum(AssignmentPrivateStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingCommitment = await ctx.db.assignmentCommitment.findUnique({
        where: { id: input.id },
      });

      if (!existingCommitment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignment commitment not found",
        });
      }

      return ctx.db.assignmentCommitment.update({
        where: { id: input.id },
        data: {
          privateStatus: input.privateStatus,
        },
      });
    }),

  toggleFavorite: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        favorite: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingCommitment = await ctx.db.assignmentCommitment.findUnique({
        where: { id: input.id },
      });

      if (!existingCommitment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignment commitment not found",
        });
      }

      return ctx.db.assignmentCommitment.update({
        where: { id: input.id },
        data: {
          favorite: input.favorite,
        },
      });
    }),

  toggleArchived: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        archived: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingCommitment = await ctx.db.assignmentCommitment.findUnique({
        where: { id: input.id },
      });

      if (!existingCommitment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignment commitment not found",
        });
      }

      return ctx.db.assignmentCommitment.update({
        where: { id: input.id },
        data: {
          archived: input.archived,
        },
      });
    }),

  deleteAssignmentCommitment: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const existingCommitment = await ctx.db.assignmentCommitment.findUnique({
        where: { id: input },
      });

      if (!existingCommitment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assignment commitment not found",
        });
      }

      return ctx.db.assignmentCommitment.delete({
        where: { id: input },
      });
    }),
});
