import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const createTreasurySchema = z.object({
  treasuryNftPolicyId: z.string().min(1),
  title: z.string().min(1),
});

const updateTreasurySchema = z.object({
  treasuryNftPolicyId: z.string().min(1),
  title: z.string().min(1).optional(),
});

export const treasuryRouter = createTRPCRouter({
  // Public procedures
  getTreasuries: publicProcedure.query(({ ctx }) => {
    return ctx.db.treasury.findMany({
      include: {
        escrows: {
          include: {
            tasks: true,
          },
        },
      },
    });
  }),

  getTreasuryById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.treasury.findUnique({
      where: { treasuryNftPolicyId: input },
      include: {
        escrows: {
          include: {
            tasks: true,
          },
        },
      },
    });
  }),

  // Protected procedures
  createTreasury: protectedProcedure
    .input(createTreasurySchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.treasury.create({
        data: input,
      });
    }),

  updateTreasury: protectedProcedure
    .input(updateTreasurySchema)
    .mutation(({ ctx, input }) => {
      const { treasuryNftPolicyId, ...updateData } = input;
      return ctx.db.treasury.update({
        where: { treasuryNftPolicyId },
        data: updateData,
      });
    }),

  deleteTreasury: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Delete associated escrows and tasks in a transaction
      return ctx.db.$transaction(async (tx) => {
        const escrows = await tx.escrow.findMany({
          where: { treasuryId: input },
        });

        // Delete all tasks for each escrow
        for (const escrow of escrows) {
          await tx.task.deleteMany({
            where: { escrowId: escrow.id },
          });
        }

        // Delete all escrows
        await tx.escrow.deleteMany({
          where: { treasuryId: input },
        });

        // Finally delete the treasury
        return tx.treasury.delete({
          where: { treasuryNftPolicyId: input },
        });
      });
    }),
});
