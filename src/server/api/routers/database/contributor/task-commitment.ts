import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { TaskCommitmentStatus, TaskStatus } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const updateTaskCommitmentEvidenceSchema = z.object({
  id: z.string().min(1),
  evidence: z.object({}).passthrough().optional(),
});

const createTaskCommitmentSchema = z.object({
  taskId: z.string().min(1),
  contributorId: z.string().min(1),
  status: z.nativeEnum(TaskCommitmentStatus).optional(),
  evidence: z.object({}).passthrough().optional(),
});


// Helper function to validate status transitions
const isValidStatusTransition = (
  currentStatus: TaskCommitmentStatus,
  newStatus: TaskCommitmentStatus,
) => {
  const allowedTransitions: Record<TaskCommitmentStatus, TaskCommitmentStatus[]> = {
    PENDING_TX_COMMITMENT_MADE: [TaskCommitmentStatus.COMMITMENT_MADE],
    COMMITMENT_MADE: [
      TaskCommitmentStatus.PENDING_TX_ADD_INFO,
      TaskCommitmentStatus.PENDING_TX_COMMITMENT_DENIED,
      TaskCommitmentStatus.PENDING_TX_COMMITMENT_REFUSED,
      TaskCommitmentStatus.PENDING_TX_COMMITMENT_ACCEPTED,
    ],
    PENDING_TX_ADD_INFO: [TaskCommitmentStatus.PENDING_APPROVAL],
    PENDING_APPROVAL: [
      TaskCommitmentStatus.PENDING_TX_COMMITMENT_MADE,
      TaskCommitmentStatus.PENDING_TX_COMMITMENT_DENIED,
      TaskCommitmentStatus.PENDING_TX_COMMITMENT_REFUSED,
      TaskCommitmentStatus.PENDING_TX_COMMITMENT_ACCEPTED
    ],
    PENDING_TX_COMMITMENT_REFUSED: [TaskCommitmentStatus.COMMITMENT_REFUSED],
    COMMITMENT_REFUSED: [TaskCommitmentStatus.PENDING_TX_ADD_INFO],

    PENDING_TX_COMMITMENT_DENIED: [TaskCommitmentStatus.COMMITMENT_DENIED],
    COMMITMENT_DENIED: [TaskCommitmentStatus.PENDING_TX_ADD_INFO],

    PENDING_TX_COMMITMENT_ACCEPTED: [TaskCommitmentStatus.COMMITMENT_ACCEPTED],
    COMMITMENT_ACCEPTED: [TaskCommitmentStatus.ARCHIVED, TaskCommitmentStatus.PENDING_TX_GET_REWARDS],

    PENDING_TX_GET_REWARDS: [TaskCommitmentStatus.REWARDS_CLAIMED],
    REWARDS_CLAIMED: [TaskCommitmentStatus.ARCHIVED],

    PENDING_TX_UNLOCKED_BY_CONTRIBUTOR: [TaskCommitmentStatus.UNLOCKED_BY_CONTRIBUTOR],
    UNLOCKED_BY_CONTRIBUTOR: [],

    ARCHIVED: [],
  };

  return allowedTransitions[currentStatus].includes(newStatus);
};


export const taskCommitmentRouter = createTRPCRouter({
  // Public procedures
  getTaskCommitments: publicProcedure
    .input(
      z.object({
        taskId: z.string().optional(),
        contributorId: z.string().optional(),
        status: z.nativeEnum(TaskCommitmentStatus).optional(),
      }).optional()
    )
    .query(({ ctx, input }) => {
      return ctx.db.taskCommitment.findMany({
        where: {
          ...(input?.taskId && { taskId: input.taskId }),
          ...(input?.contributorId && { contributorId: input.contributorId }),
          ...(input?.status && { status: input.status }),
        },
        include: {
          task: {
            include: {
              escrow: true,
            },
          },
          contributor: {
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

  getTaskCommitmentById: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.taskCommitment.findUnique({
        where: { id: input },
        include: {
          task: {
            include: {
              escrow: true,
            },
          },
          contributor: {
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

  getTaskCommitmentsByTreasury: publicProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().min(56),
        taskId: z.string().optional(),
        contributorId: z.string().optional(),
        status: z.nativeEnum(TaskCommitmentStatus).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const taskCommitments = await ctx.db.taskCommitment.findMany({
        where: {
          task: {
            escrow: {
              treasury: {
                treasuryNftPolicyId: input?.treasuryNftPolicyId,
              },
            },
          },
          ...(input?.status && { status: input.status }),
        },
        include: {
          task: {
            include: {
              escrow: true,
            },
          },
          contributor: {
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
        orderBy: [
          { updated: 'desc' },
          { created: 'desc' },
        ],
      });

      return taskCommitments;
    }),

  // Protected procedures
  createTaskCommitment: protectedProcedure
    .input(createTaskCommitmentSchema)
    .mutation(async ({ ctx, input }) => {
      const existingCommitment = await ctx.db.taskCommitment.findUnique({
        where: {
          taskId_contributorId: {
            taskId: input.taskId,
            contributorId: input.contributorId,
          },
        },
      });

      if (existingCommitment) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A commitment for this task already exists",
        });
      }

      return ctx.db.taskCommitment.create({
        data: input,
        include: {
          task: true,
          contributor: {
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

  // Task Commitment Evidence is updated according to Contributor input in Andamio Platform
  updateTaskCommitmentEvidence: protectedProcedure
    .input(updateTaskCommitmentEvidenceSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const existingCommitment = await ctx.db.taskCommitment.findUnique({
        where: { id },
      });

      if (!existingCommitment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task commitment not found",
        });
      }

      return ctx.db.taskCommitment.update({
        where: { id },
        data: {
          ...updateData,
          updated: new Date(),
        },
      });
    }),

  // Task Commitment Status is updated according to on-chain events
  updateTaskCommitmentStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        status: z.nativeEnum(TaskCommitmentStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, status } = input;

      return ctx.db.$transaction(async (tx) => {
        // Get existing commitment with task
        const existingCommitment = await tx.taskCommitment.findUnique({
          where: { id },
          include: { task: true }
        });

        if (!existingCommitment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Task commitment not found",
          });
        }

        if (!isValidStatusTransition(existingCommitment.status, status)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Invalid status transition from ${existingCommitment.status} to ${input.status}`,
          });
        }

        // Handle coupled status transitions
        // Add more couple status transitions here -- after implementing a full polling loop
        if (status === TaskCommitmentStatus.COMMITMENT_MADE &&
          existingCommitment.status === TaskCommitmentStatus.PENDING_TX_COMMITMENT_MADE) {

          // Update task status first
          await tx.task.update({
            where: { id: existingCommitment.task.id },
            data: {
              status: TaskStatus.COMMITMENT_MADE,
            }
          });
        }

        if (status === TaskCommitmentStatus.COMMITMENT_ACCEPTED &&
          existingCommitment.status === TaskCommitmentStatus.PENDING_TX_COMMITMENT_ACCEPTED) {

          // Update task status first
          await tx.task.update({
            where: { id: existingCommitment.task.id },
            data: {
              status: TaskStatus.COMMITMENT_ACCEPTED,
            }
          });
        }

        // Update the commitment status
        return tx.taskCommitment.update({
          where: { id },
          data: {
            status,
            updated: new Date(),
          },
        });
      });

    }),

  deleteTaskCommitment: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const existingCommitment = await ctx.db.taskCommitment.findUnique({
        where: { id: input },
      });

      if (!existingCommitment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task commitment not found",
        });
      }

      return ctx.db.taskCommitment.delete({
        where: { id: input },
      });
    }),
});
