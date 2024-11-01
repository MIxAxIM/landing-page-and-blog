import { type Treasury } from "@prisma/client";
import { type inferAsyncReturnType } from "@trpc/server";
import { z } from "zod";

import {
  type createTRPCContext,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

type TreasuryWithCount = Treasury & {
  _count: {
    escrows: number;
  };
};

// Define the final type including totalAda
type TreasuryWithTotals = TreasuryWithCount & {
  totalAda: number;
  totalTasks: number;
};
type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;

const createTreasurySchema = z.object({
  treasuryNftPolicyId: z.string().min(1),
  title: z.string().min(1),
});

const updateTreasurySchema = z.object({
  treasuryNftPolicyId: z.string().min(1),
  title: z.string().min(1).optional(),
});

// Helper function to calculate total ADA from tasks
const calculateTotalAda = (tasks: { lovelace: string }[]) => {
  return tasks.reduce((sum, task) => {
    const lovelaceAmount = parseInt(task.lovelace);
    return sum + lovelaceAmount / 1_000_000;
  }, 0);
};

// Helper function to transform treasury data with totals
const transformTreasuryWithTotals = async (
  treasury: TreasuryWithCount,
  ctx: TRPCContext,
): Promise<TreasuryWithTotals> => {
  // Get all escrows with their tasks for this treasury
  const escrows = await ctx.db.escrow.findMany({
    where: { treasuryId: treasury.treasuryNftPolicyId },
    include: { tasks: true, _count: { select: { tasks: true } } },
  });

  // Calculate total ADA across all escrows
  const totalAda = escrows.reduce((sum, escrow) => {
    return sum + calculateTotalAda(escrow.tasks);
  }, 0);

  const totalTasks = escrows.reduce((sum, escrow) => {
    return sum + escrow.tasks.length;
  }, 0);

  return {
    ...treasury,
    totalAda,
    totalTasks,
  };
};

export const treasuryRouter = createTRPCRouter({
  // Public procedures
  getTreasuries: publicProcedure.query(async ({ ctx }) => {
    const treasuries = await ctx.db.treasury.findMany({
      include: {
        _count: {
          select: { escrows: true },
        },
      },
    });

    const treasuriesWithAda = await Promise.all(
      treasuries.map((treasury) => transformTreasuryWithTotals(treasury, ctx)),
    );

    return treasuriesWithAda;
  }),

  getTreasuryById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const treasury = await ctx.db.treasury.findUnique({
        where: { treasuryNftPolicyId: input },
        include: {
          _count: {
            select: { escrows: true },
          },
        },
      });

      if (!treasury) return null;

      return transformTreasuryWithTotals(treasury, ctx);
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
