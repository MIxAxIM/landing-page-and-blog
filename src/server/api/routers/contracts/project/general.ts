import { UtxoWithSlot } from "@maestro-org/typescript-sdk";
import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const projectGeneralRouter = createTRPCRouter({
  getInstancesInfo: publicProcedure.query(async () => {
    const instances = await indexerGetWithParams<UtxoWithSlot[], any>(
      "/instance-validator/utxos",
      {
        filter: "TreasuryScripts",
      },
    );
    const policies = instances.map((utxo) => {
      return JSON.parse(JSON.stringify(utxo.datum!.json)).bytes as string;
    });
    return {
      policies: policies,
    };
  }),

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
});
