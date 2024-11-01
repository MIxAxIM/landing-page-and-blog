import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { TaskStatus } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

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
  status: z.nativeEnum(TaskStatus).optional(),
  lovelace: z.string().min(7),
  expirationTime: z.string().min(10),
});

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
            status: input.task.status ?? TaskStatus.DRAFT,
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
    .mutation(({ ctx, input }) => {
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

      // Add any status transition validations here
      // For example, preventing going from DRAFT directly to COMPLETE
      const validTransitions: Record<TaskStatus, TaskStatus[]> = {
        DRAFT: [TaskStatus.APPROVED],
        APPROVED: [TaskStatus.ON_CHAIN, TaskStatus.DRAFT],
        ON_CHAIN: [TaskStatus.COMMITMENT_MADE, TaskStatus.APPROVED],
        COMMITMENT_MADE: [TaskStatus.COMPLETE, TaskStatus.ON_CHAIN],
        COMPLETE: [TaskStatus.COMMITMENT_MADE],
      };

      if (!validTransitions[task.status].includes(input.status)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid status transition from ${task.status} to ${input.status}`,
        });
      }

      return ctx.db.task.update({
        where: { id: input.id },
        data: { status: input.status },
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
            escrowNftPolicyId: escrow.escrowNftPolicyId,
            treasuryId: escrow.treasuryId,
            contributorPolicyIds: escrow.contributorPolicyIds,
          },
        })),
      );

      return tasks;
    }),
});
