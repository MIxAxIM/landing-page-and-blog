import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const createEscrowSchema = z.object({
  title: z.string().optional(),
  escrowNftPolicyId: z.string().optional(),
  treasuryId: z.string().min(1),
  savedAcceptanceCriteria: z.array(z.string()).default([]),
});

const updateEscrowSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  escrowNftPolicyId: z.string().min(1).optional(), // TODO: should user be able to update this for any reason?
  savedAcceptanceCriteria: z.array(z.string()).optional(),
  isSyncedWithNetwork: z.boolean().optional(),
});

const updateEscrowSyncStatusSchema = z.object({
  id: z.string().min(1),
  isSyncedWithNetwork: z.boolean(),
});

// Helper function to calculate total ADA from tasks
export const calculateTotalAda = (tasks: { lovelace: string }[]) => {
  return tasks.reduce((sum, task) => {
    const lovelaceAmount = parseInt(task.lovelace);
    return sum + lovelaceAmount / 1_000_000; // Convert lovelace to ADA
  }, 0);
};

export const escrowRouter = createTRPCRouter({
  // Public procedures
  getEscrows: publicProcedure.query(async ({ ctx }) => {
    const escrows = await ctx.db.escrow.findMany({
      include: {
        treasury: true,
        tasks: {
          include: {
            taskCommitments: {
              select: {
                id: true,
                status: true,
                contributorId: true,
              }
            }
          }
        },
      },
    });

    return escrows.map((escrow) => ({
      ...escrow,
      totalAda: calculateTotalAda(escrow.tasks),
    }));
  }),

  getEscrowById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const escrow = await ctx.db.escrow.findUnique({
        where: { id: input },
        include: {
          tasks: {
            include: {
              taskCommitments: {
                select: {
                  id: true,
                  status: true,
                  contributorId: true,
                }
              }
            }
          },
          contributorPrerequisites: true,
        },
      });

      if (!escrow) return null;

      return {
        ...escrow,
        totalAda: calculateTotalAda(escrow.tasks),
      };
    }),

  getEscrowByPolicyId: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const escrow = await ctx.db.escrow.findUnique({
        where: { escrowNftPolicyId: input },
        include: {
          treasury: true,
          tasks: {
            include: {
              taskCommitments: {
                select: {
                  id: true,
                  status: true,
                  contributorId: true,
                }
              }
            }
          },
          contributorPrerequisites: true,
        },
      });

      if (!escrow) return null;

      return {
        ...escrow,
        totalAda: calculateTotalAda(escrow.tasks),
      };
    }),

  getTreasuryEscrows: publicProcedure
    .input(z.object({
      treasuryNftPolicyId: z.string().min(56)
    }))
    .query(async ({ ctx, input }) => {
      const treasury = await ctx.db.treasury.findUnique({
        where: { treasuryNftPolicyId: input.treasuryNftPolicyId },
        select: {
          title: true,
          escrows: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });

      if (!treasury) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Treasury not found"
        });
      }

      return {
        title: treasury.title,
        escrows: treasury.escrows
      };
    }),

  getEscrowPrerequisites: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.escrow
        .findUnique({
          where: { id: input },
          include: {
            contributorPrerequisites: {
              include: {
                courseRequirements: {
                  include: {
                    course: {
                      select: {
                        id: true,
                        courseCode: true,
                        title: true,
                        courseNftPolicyId: true,
                      },
                    },
                  },
                },
              },
            },
          },
        })
        .then((escrow) => escrow?.contributorPrerequisites ?? []);
    }),

  // Protected procedures
  createEscrow: protectedProcedure
    .input(createEscrowSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify treasury exists first
      const treasury = await ctx.db.treasury.findUnique({
        where: { id: input.treasuryId },
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

  updateEscrowSyncStatus: protectedProcedure
    .input(updateEscrowSyncStatusSchema)
    .mutation(({ ctx, input }) => {
      const { id, isSyncedWithNetwork } = input;
      return ctx.db.escrow.update({
        where: { id },
        data: { isSyncedWithNetwork: isSyncedWithNetwork },
      });
    }),

  deleteEscrow: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Delete associated tasks and escrow in a transaction
      return ctx.db.$transaction(async (tx) => {
        // Delete all contributor prerequisites relations

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

  addPrerequisite: protectedProcedure
    .input(
      z.object({
        escrowId: z.string(),
        prerequisiteId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.escrow.update({
        where: { id: input.escrowId },
        data: {
          contributorPrerequisites: {
            connect: { id: input.prerequisiteId },
          },
        },
      });
    }),

  removePrerequisite: protectedProcedure
    .input(
      z.object({
        escrowId: z.string(),
        prerequisiteId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.escrow.update({
        where: { id: input.escrowId },
        data: {
          contributorPrerequisites: {
            disconnect: { id: input.prerequisiteId },
          },
        },
      });
    }),
});
