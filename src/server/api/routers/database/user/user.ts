import { type User } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getUserByName: publicProcedure
    .input(z.object({ username: z.string().min(3) }))
    .query(({ ctx, input }) => {
      const users = ctx.db.user.findMany({
        where: {
          name: {
            contains: input.username,
          },
        },
        include: {
          creator: {
            select: {
              id: true,
              userId: true,
              courses: true,
            },
          },
          learner: {
            select: {
              id: true,
              lessons: {
                select: {
                  id: true,
                },
              },
              assignments: true,
            },
          },
        },
      });

      if (users === undefined) {
        return [];
      } else {
        return users as Promise<User[]>;
      }
    }),

  getUserById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.id,
        },
        include: {
          creator: true,
          learner: {
            select: {
              id: true,
              lessons: {
                select: {
                  id: true,
                },
              },
              assignments: {
                select: {
                  id: true,
                  assignmentId: true,
                },
              },
            },
          },
        },
      });

      if (user === null) {
        throw new Error("User not found");
      } else {
        return user;
      }
    }),

  getUserByPubkey: publicProcedure
    .input(z.object({ pubkey: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findMany({
        where: {
          nostrPubkey: input.pubkey,
        },
      });

      if (user.length === 0) {
        throw new Error("User not found");
      } else {
        return user[0];
      }
    }),

  updateHasMintedAccessToken: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        hasMinted: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          hasMintedAccessToken: input.hasMinted,
        },
      });
    }),

  updateAccessTokenMintTx: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        txHash: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          accessTokenMintTx: input.txHash,
        },
      });
    }),

  updateUnconfirmedTx: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        txHash: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          unconfirmedTx: input.txHash,
        },
      });
    }),

  updateUserNsec: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        nsec: z.string(),
        pubkey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          nostrNsec: input.nsec,
          nostrPubkey: input.pubkey,
        },
      });
    }),

  updateUserTncVersion: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        tncVersion: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          id: input.userId,
        },
        data: {
          tncVersion: input.tncVersion,
        },
      });
    }),
});
