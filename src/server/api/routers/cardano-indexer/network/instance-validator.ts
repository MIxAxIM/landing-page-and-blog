/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { type UtxoWithSlot } from "@maestro-org/typescript-sdk";

import { indexerGetWithParams } from "~/lib/axios/indexer";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
