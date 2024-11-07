import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { TaskStatus } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { generateTaskHash } from "~/utils/hashing";

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  acceptanceCriteria: z.array(z.string()),
  status: z.nativeEnum(TaskStatus).optional(),
  lovelace: z.string().min(7),
  expirationTime: z.string().min(10),
});

const updateTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  acceptanceCriteria: z.array(z.string()).optional(),
  lovelace: z.string().min(7),
  expirationTime: z.string().min(10),
});

// Helper function to validate status transitions
const isValidStatusTransition = (
  currentStatus: TaskStatus,
  newStatus: TaskStatus,
) => {
  const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
    DRAFT: [TaskStatus.APPROVED, TaskStatus.BACKLOG, TaskStatus.ARCHIVED],
    APPROVED: [
      TaskStatus.DRAFT,
      TaskStatus.ON_CHAIN,
      TaskStatus.BACKLOG,
      TaskStatus.ARCHIVED,
    ],
    ON_CHAIN: [TaskStatus.COMMITMENT_MADE],
    COMMITMENT_MADE: [
      TaskStatus.COMMITMENT_ACCEPTED,
      TaskStatus.COMMITMENT_DENIED,
    ],
    COMMITMENT_DENIED: [TaskStatus.ON_CHAIN, TaskStatus.COMMITMENT_MADE],
    COMMITMENT_ACCEPTED: [TaskStatus.ARCHIVED],
    BACKLOG: [TaskStatus.DRAFT, TaskStatus.ARCHIVED],
    ARCHIVED: [TaskStatus.BACKLOG, TaskStatus.DRAFT],
  };

  return allowedTransitions[currentStatus].includes(newStatus);
};

export const taskRouter = createTRPCRouter({
  // Public procedures
  getTasks: publicProcedure.query(({ ctx }) => {
    return ctx.db.task.findMany({
      include: {
        escrow: true,
      },
    });
  }),

  getTaskById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.task.findUnique({
      where: { id: input },
      include: {
        escrow: true,
      },
    });
  }),

  getEscrowTasks: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.task.findMany({
      where: { escrowId: input },
      orderBy: { index: "asc" },
    });
  }),

  // Protected procedures
  createTask: protectedProcedure
    .input(
      z.object({
        escrowId: z.string(),
        task: taskSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (tx) => {
        // Verify escrow exists
        const escrow = await tx.escrow.findUnique({
          where: { id: input.escrowId },
        });

        if (!escrow) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Escrow not found",
          });
        }

        // Find highest index for this escrow
        const highestIndexTask = await tx.task.findFirst({
          where: { escrowId: input.escrowId },
          orderBy: { index: "desc" },
        });

        const nextIndex = highestIndexTask ? highestIndexTask.index + 1 : 1;

        return tx.task.create({
          data: {
            ...input.task,
            status: TaskStatus.DRAFT,
            escrowId: input.escrowId,
            index: nextIndex,
            lovelace: input.task.lovelace,
            expirationTime: input.task.expirationTime,
          },
        });
      });
    }),

  updateTask: protectedProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.task.findUnique({
        where: { id: input.id },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      if (task.status !== TaskStatus.DRAFT) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only tasks in DRAFT status can be updated",
        });
      }

      const { id, ...updateData } = input;
      return ctx.db.task.update({
        where: { id },
        data: updateData,
      });
    }),

  updateTaskStatus: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1),
        status: z.nativeEnum(TaskStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.task.findUnique({
        where: { id: input.id },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      if (!isValidStatusTransition(task.status, input.status)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid status transition from ${task.status} to ${input.status}`,
        });
      }

      // Generate hash when moving from DRAFT to APPROVED
      if (
        task.status === TaskStatus.DRAFT &&
        input.status === TaskStatus.APPROVED
      ) {
        const hash = generateTaskHash({
          title: task.title,
          description: task.description,
          acceptanceCriteria: task.acceptanceCriteria,
        });

        return ctx.db.task.update({
          where: { id: input.id },
          data: {
            status: input.status,
            hash,
          },
        });
      }

      // Clear hash when moving back to DRAFT from APPROVED
      if (
        task.status === TaskStatus.APPROVED &&
        input.status === TaskStatus.DRAFT
      ) {
        return ctx.db.task.update({
          where: { id: input.id },
          data: {
            status: input.status,
            hash: null,
          },
        });
      }

      // Regular status update
      return ctx.db.task.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  revertToDraftFromApproved: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.task.findUnique({
        where: { id: input },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      if (task.status !== TaskStatus.APPROVED) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Only tasks in APPROVED status can be reverted to draft",
        });
      }

      return ctx.db.task.update({
        where: { id: input },
        data: {
          status: TaskStatus.DRAFT,
          hash: null,
        },
      });
    }),

  deleteTask: protectedProcedure
    .input(z.string())
    .mutation(({ ctx, input }) => {
      return ctx.db.task.delete({
        where: { id: input },
      });
    }),

  getTasksByStatus: publicProcedure
    .input(
      z.object({
        escrowId: z.string().optional(),
        status: z.nativeEnum(TaskStatus),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.task.findMany({
        where: {
          ...(input.escrowId ? { escrowId: input.escrowId } : {}),
          status: input.status,
        },
        orderBy: { index: "asc" },
        include: {
          escrow: true,
        },
      });
    }),

  // Update duplicateTask to copy status
  duplicateTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        targetEscrowId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.$transaction(async (tx) => {
        const originalTask = await tx.task.findUnique({
          where: { id: input.taskId },
        });

        if (!originalTask) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Original task not found",
          });
        }

        const highestIndexTask = await tx.task.findFirst({
          where: { escrowId: input.targetEscrowId },
          orderBy: { index: "desc" },
        });

        const nextIndex = highestIndexTask ? highestIndexTask.index + 1 : 1;

        return tx.task.create({
          data: {
            title: originalTask.title,
            description: originalTask.description,
            acceptanceCriteria: originalTask.acceptanceCriteria,
            status: TaskStatus.DRAFT, // Always create duplicates as DRAFT
            lovelace: originalTask.lovelace,
            expirationTime: originalTask.expirationTime,
            escrowId: input.targetEscrowId,
            index: nextIndex,
          },
        });
      });
    }),

  getTreasuryTasks: publicProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string(),
        status: z.array(z.nativeEnum(TaskStatus)).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const treasury = await ctx.db.treasury.findUnique({
        where: { treasuryNftPolicyId: input.treasuryNftPolicyId },
        include: {
          escrows: {
            include: {
              tasks: {
                where: input.status
                  ? {
                      status: {
                        in: input.status,
                      },
                    }
                  : undefined,
                orderBy: { index: "asc" },
              },
              contributorPrerequisites: {
                select: {
                  contributorPolicyId: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      if (!treasury) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Treasury not found",
        });
      }

      const tasks = treasury.escrows.flatMap((escrow) =>
        escrow.tasks.map((task) => ({
          ...task,
          escrow: {
            id: escrow.id,
            title: escrow.title,
            escrowNftPolicyId: escrow.escrowNftPolicyId,
            treasuryId: escrow.treasuryId,
            isSyncedWithNetwork: escrow.isSyncedWithNetwork,
            savedAcceptanceCriteria: escrow.savedAcceptanceCriteria,
            contributorPrerequisites: escrow.contributorPrerequisites,
          },
        })),
      );

      return tasks;
    }),
});
