import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const createPrerequisiteSchema = z.object({
  contributorPolicyId: z.string().min(1),
  title: z.string().optional(),
  prerequisites: z.array(z.string()),
});

const updatePrerequisiteSchema = z.object({
  contributorPolicyId: z.string().min(1),
  title: z.string().optional(),
  prerequisites: z.array(z.string()).optional(),
});

export const contributorPrerequisiteRouter = createTRPCRouter({
  // Public procedures
  getPrerequisites: publicProcedure.query(({ ctx }) => {
    return ctx.db.contributorPrerequisite.findMany({
      include: {
        escrows: {
          include: {
            escrow: true,
          },
        },
      },
    });
  }),

  getPrerequisiteById: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.contributorPrerequisite.findUnique({
        where: { contributorPolicyId: input },
        include: {
          escrows: {
            include: {
              escrow: true,
            },
          },
        },
      });
    }),

  // Protected procedures
  createPrerequisite: protectedProcedure
    .input(createPrerequisiteSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.contributorPrerequisite.create({
        data: input,
      });
    }),

  updatePrerequisite: protectedProcedure
    .input(updatePrerequisiteSchema)
    .mutation(({ ctx, input }) => {
      const { contributorPolicyId, ...updateData } = input;
      return ctx.db.contributorPrerequisite.update({
        where: { contributorPolicyId },
        data: updateData,
      });
    }),

  deletePrerequisite: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      // Delete the prerequisite and all its relations in a transaction
      return ctx.db.$transaction(async (tx) => {
        // Delete all escrow relations first
        await tx.escrowContributorPrerequisites.deleteMany({
          where: { contributorPrerequisiteId: input },
        });

        // Delete the prerequisite
        return tx.contributorPrerequisite.delete({
          where: { contributorPolicyId: input },
        });
      });
    }),
});
