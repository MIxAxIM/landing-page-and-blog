import { TaskStatus, type Treasury } from "@prisma/client";
import { TRPCError, type inferAsyncReturnType } from "@trpc/server";
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
  escrowIds: string[];
};
type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>;

const createTreasurySchema = z.object({
  treasuryNftPolicyId: z.string().optional(),
  title: z.string().min(1),
  treasuryOwnerId: z.string().min(1),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
});

const initializeTreasuryWithEscrowSchema = z.object({
  treasuryNftPolicyId: z.string().optional(),
  title: z.string().min(1),
  treasuryOwnerId: z.string().min(1),
})
//escrow: z.object({
//  escrowNftPolicyId: z.string().optional(),
//  title: z.string().optional(),
//  savedAcceptanceCriteria: z.array(z.string()).default([]),
//}),
//});

const updateTreasurySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).optional(),
  treasuryNftPolicyId: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  live: z.boolean().optional(),
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
    where: { treasuryId: treasury.id }, // Updated to use id instead of treasuryNftPolicyId
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
    escrowIds: escrows.map(escrow => escrow.id)
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
        escrows: { select: { id: true, tasks: true } }
      },
      orderBy: {
        title: "asc",
      }
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
        where: { id: input },
        include: {
          _count: {
            select: { escrows: true },
          },
        },
      });

      if (!treasury) return null;

      return transformTreasuryWithTotals(treasury, ctx);
    }),

  getTreasuryByPolicyId: publicProcedure
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

  getTreasuryAmountsByStatus: publicProcedure
    .input(z.object({
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      // Get all tasks for all escrows in this treasury
      const escrows = await ctx.db.escrow.findMany({
        where: { treasuryId: input.id },
        include: {
          tasks: {
            select: {
              status: true,
              lovelace: true
            }
          }
        }
      });

      // Initialize amounts object with all possible statuses set to 0
      const amounts: Record<TaskStatus, {
        totalLovelace: string,
        totalAda: number,
        count: number
      }> = Object.values(TaskStatus).reduce((acc, status) => ({
        ...acc,
        [status]: {
          totalLovelace: "0",
          totalAda: 0,
          count: 0
        }
      }), {} as Record<TaskStatus, { totalLovelace: string, totalAda: number, count: number }>);

      // Aggregate amounts by status
      escrows.forEach(escrow => {
        escrow.tasks.forEach(task => {
          const lovelace = BigInt(task.lovelace);
          const currentTotalLovelace = BigInt(amounts[task.status].totalLovelace);
          const newTotalLovelace = currentTotalLovelace + lovelace;

          amounts[task.status].totalLovelace = newTotalLovelace.toString();
          amounts[task.status].totalAda = Number(newTotalLovelace) / 1_000_000;
          amounts[task.status].count++;
        });
      });

      const totalLovelace = Object.values(amounts)
        .reduce((sum, { totalLovelace }) => sum + BigInt(totalLovelace), BigInt(0));

      return {
        amounts,
        summary: {
          totalLovelace: totalLovelace.toString(),
          totalAda: Number(totalLovelace) / 1_000_000,
          totalTasks: Object.values(amounts)
            .reduce((sum, { count }) => sum + count, 0)
        }
      };
    }),

  // TODO: Implement adding policy ids at time of Admin Transactions

  // Protected procedures
  createTreasury: protectedProcedure
    .input(createTreasurySchema)
    .mutation(async ({ ctx, input }) => {
      // Get user's current subscription and product details
      const subscription = await ctx.db.subscription.findUnique({
        where: { userId: ctx.session.user.id },
        include: { product: true },
      });

      // Get user's current treasury count
      const treasuryCount = await ctx.db.treasury.count({
        where: { treasuryOwnerId: input.treasuryOwnerId },
      });

      // Users without subscription can create 1 treasury
      if (!subscription && treasuryCount >= 1) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Subscribe to create more than one treasury",
        });
      }

      // Check if subscribed user has reached their treasury limit
      if (subscription && treasuryCount >= subscription.product.maxAllowedTreasuries) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Your subscription allows up to ${subscription.product.maxAllowedTreasuries} treasuries`,
        });
      }

      return ctx.db.treasury.create({
        data: input,
      });
    }),

  initializeTreasuryWithEscrow: protectedProcedure
    .input(initializeTreasuryWithEscrowSchema)
    .mutation(async ({ ctx, input }) => {
      // Get user's current subscription and product details
      const subscription = await ctx.db.subscription.findUnique({
        where: { userId: ctx.session.user.id },
        include: { product: true },
      });

      // Get user's current treasury count
      const treasuryCount = await ctx.db.treasury.count({
        where: { treasuryOwnerId: input.treasuryOwnerId },
      });

      // Users without subscription can create 1 treasury
      if (!subscription && treasuryCount >= 1) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Subscribe to create more than one treasury",
        });
      }

      // Check if subscribed user has reached their treasury limit
      if (subscription && treasuryCount >= subscription.product.maxAllowedTreasuries) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Your subscription allows up to ${subscription.product.maxAllowedTreasuries} treasuries`,
        });
      }

      // Use a transaction to ensure both treasury and escrow are created or neither is
      return ctx.db.$transaction(async (tx) => {
        // Create the treasury first
        const treasury = await tx.treasury.create({
          data: input,
        });

        // Create an escrow with a matching new in the new treasury
        const escrow = await tx.escrow.create({
          data: {
            title: input.title,
            treasuryId: treasury.id,
          },
        });

        // Return both created entities
        return {
          treasury,
          escrow,
        };
      });
    }),

  updateTreasury: protectedProcedure
    .input(updateTreasurySchema)
    .mutation(({ ctx, input }) => {
      const { id, ...updateData } = input;
      return ctx.db.treasury.update({
        where: { id },
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
          where: { id: input },
        });
      });
    }),
});
