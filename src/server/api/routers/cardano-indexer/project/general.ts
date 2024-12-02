import { UtxoWithSlot } from "@maestro-org/typescript-sdk";
import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const projectGeneralRouter = createTRPCRouter({
  getTreasuryInfo: publicProcedure
    .input(
      z.object({
        policy: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      const info = await indexerGetWithParams<any, any>("/treasury/info", {
        policy: input.policy,
      });
      return {
        info: info,
      };
    }),

  addFunds: publicProcedure
    .input(
      z.object({
        policy: z.string(),
        dipositorsAddress: z.string(),
        adaAmount: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const txCbor = await indexerGetWithParams<any, any>("/tx/treasury/add-funds", {
        policy: input.policy,
        user_address: input.dipositorsAddress,
        amount: input.adaAmount,
      });
      return {
        txCbor: txCbor,
      };
    }),
});
