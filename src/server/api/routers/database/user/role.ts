import { User } from "@prisma/client";
import { create } from "domain";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const roleRouter = createTRPCRouter({
  updateSessionRole: protectedProcedure
    .input(
      z.object({
        sessionId: z.string(),
        accessToken: z.string(),
        team: z.string(),
        role: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Check if the role already exists
      let role = await ctx.db.role.findFirst({
        where: {
          accessToken: input.accessToken,
          team: input.team,
          role: input.role,
        },
      });

      // If role does not exist, create a new role
      if (!role) {
        role = await ctx.db.role.create({
          data: {
            accessToken: input.accessToken,
            team: input.team,
            role: input.role,
          },
        });
      }

      return ctx.db.session.update({
        where: {
          id: input.sessionId,
        },
        data: {
          role: {
            connect: {
              id: role.id,
            },
          },
        },
      });
    }),
});
