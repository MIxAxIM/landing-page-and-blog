import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const createEscrowSchema = z.object({
  title: z.string().min(1),
  escrowNftPolicyId: z.string().min(1),
  contributorPolicyIds: z.array(z.string()),
  treasuryId: z.string().min(1),
});

const updateEscrowSchema = z.object({
  title: z.string().min(1),
  id: z.string().min(1),
  escrowNftPolicyId: z.string().min(1).optional(),
  contributorPolicyIds: z.array(z.string()).optional(),
});

export const escrowRouter = createTRPCRouter({
  // Public procedures
  getEscrows: publicProcedure.query(({ ctx }) => {
    return ctx.db.escrow.findMany({
      include: {
        treasury: true,
        tasks: true,
      },
    });
  }),

  getEscrowById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.escrow.findUnique({
      where: { id: input },
      include: {
        tasks: true,
      },
    });
  }),

  getEscrowByPolicyId: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.escrow.findUnique({
        where: { escrowNftPolicyId: input },
        include: {
          treasury: true,
          tasks: true,
        },
      });
    }),

  getTreasuryEscrows: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.escrow.findMany({
        where: { treasuryId: input },
        include: {
          tasks: true,
        },
      });
    }),

  // Protected procedures
  createEscrow: protectedProcedure
    .input(createEscrowSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify treasury exists first
      const treasury = await ctx.db.treasury.findUnique({
        where: { treasuryNftPolicyId: input.treasuryId },
      });

      if (!treasury) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Treasury not found",
        });
      }

      return ctx.db.escrow.create({
        data: input,
      });
    }),

  updateEscrow: protectedProcedure
    .input(updateEscrowSchema)
    .mutation(({ ctx, input }) => {
      const { id, ...updateData } = input;
      return ctx.db.escrow.update({
        where: { id },
        data: updateData,
      });
    }),

  deleteEscrow: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Delete associated tasks and escrow in a transaction
      return ctx.db.$transaction(async (tx) => {
        // Delete all tasks
        await tx.task.deleteMany({
          where: { escrowId: input },
        });

        // Delete the escrow
        return tx.escrow.delete({
          where: { id: input },
        });
      });
    }),
});
