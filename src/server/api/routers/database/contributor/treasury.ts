import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const treasuryRouter = createTRPCRouter({
  getTreasuries: publicProcedure.query(({ ctx }) => {
    return ctx.db.treasury.findMany();
  }),
});
