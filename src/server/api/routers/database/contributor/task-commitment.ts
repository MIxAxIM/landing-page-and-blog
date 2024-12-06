import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { TaskCommitmentStatus } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const updateTaskCommitmentSchema = z.object({
  id: z.string().min(1),
  status: z.nativeEnum(TaskCommitmentStatus).optional(),
  evidence: z.object({}).passthrough().optional(),
});

const createTaskCommitmentSchema = z.object({
  taskId: z.string().min(1),
  contributorId: z.string().min(1),
  status: z.nativeEnum(TaskCommitmentStatus).optional(),
  evidence: z.object({}).passthrough().optional(),
});

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
                  email: true,
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
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      });
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

  updateTaskCommitment: protectedProcedure
    .input(updateTaskCommitmentSchema)
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
