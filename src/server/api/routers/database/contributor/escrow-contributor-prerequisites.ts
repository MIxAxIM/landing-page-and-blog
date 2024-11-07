import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const prerequisiteRelationSchema = z.object({
  escrowId: z.string().min(1),
  contributorPrerequisiteId: z.string().min(1),
});

export const escrowPrerequisitesRouter = createTRPCRouter({
  // Public procedures
  getEscrowPrerequisites: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.escrowContributorPrerequisites.findMany({
        where: { escrowId: input },
        include: {
          contributorPrerequisite: true,
        },
      });
    }),

  getPrerequisiteEscrows: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.escrowContributorPrerequisites.findMany({
        where: { contributorPrerequisiteId: input },
        include: {
          escrow: true,
        },
      });
    }),

  // Protected procedures
  addPrerequisiteToEscrow: protectedProcedure
    .input(prerequisiteRelationSchema)
    .mutation(async ({ ctx, input }) => {
      // Verify both escrow and prerequisite exist
      const [escrow, prerequisite] = await Promise.all([
        ctx.db.escrow.findUnique({
          where: { id: input.escrowId },
        }),
        ctx.db.contributorPrerequisite.findUnique({
          where: { contributorPolicyId: input.contributorPrerequisiteId },
        }),
      ]);

      if (!escrow || !prerequisite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Escrow or prerequisite not found",
        });
      }

      return ctx.db.escrowContributorPrerequisites.create({
        data: input,
      });
    }),

  removePrerequisiteFromEscrow: protectedProcedure
    .input(prerequisiteRelationSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.escrowContributorPrerequisites.delete({
        where: {
          escrowId_contributorPrerequisiteId: {
            escrowId: input.escrowId,
            contributorPrerequisiteId: input.contributorPrerequisiteId,
          },
        },
      });
    }),
});
