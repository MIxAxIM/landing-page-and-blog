import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        lovelaceAmount: z.number(),
        projectTokenAmount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const newProject = await ctx.db.project.create({
        data: {
          title: input.title,
          description: input.description,
          lovelaceAmount: input.lovelaceAmount,
          projectTokenAmount: input.projectTokenAmount,
          owner: { connect: { id: ctx.session.role.id } },
        },
      });

      return newProject;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        lovelaceAmount: z.number(),
        projectTokenAmount: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          description: input.description,
          lovelaceAmount: input.lovelaceAmount,
          projectTokenAmount: input.projectTokenAmount,
          owner: { connect: { id: ctx.session.role.id } },
        },
      });
    }),

  getProjects: publicProcedure.input(z.object({})).query(({ ctx, input }) => {
    return ctx.db.project.findMany({});
  }),

  getProjectById: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.project.findFirst({
        where: {
          id: input.id,
        },
      });
    }),
});
