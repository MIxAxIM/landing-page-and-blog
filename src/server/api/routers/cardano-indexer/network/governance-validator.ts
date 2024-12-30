
import { type UtxoWithSlot } from "@maestro-org/typescript-sdk";
import { z } from "zod";

import { indexerGetWithParams } from "~/lib/axios/indexer";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// TODO: Use other filters as shown in API docs

export const governanceValidatorRouter = createTRPCRouter({
  getGovernanceValidatorUtxos: publicProcedure
    .input(z.object({ policyId: z.string().length(56) }))
    .query(async ({ input }) => {
      const policyId: string = input.policyId
      const instances = await indexerGetWithParams<UtxoWithSlot[], { policyId: string }>(
        "/governance-validator/utxos",
        { policyId }
      );
      return instances
    }),

});
