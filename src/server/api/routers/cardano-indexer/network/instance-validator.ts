import { UtxoWithSlot } from "@maestro-org/typescript-sdk";

import { indexerGetWithParams } from "~/lib/axios/indexer";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

// TODO: Add remaining filters 2024-12-04

export const instanceValidatorRouter = createTRPCRouter({
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

});
