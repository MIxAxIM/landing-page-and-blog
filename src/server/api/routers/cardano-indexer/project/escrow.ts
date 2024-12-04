import { UtxoWithSlot } from "@maestro-org/typescript-sdk";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Contributor State
export const escrowValidatorRouter = createTRPCRouter({
  // Escrow
  getAllEscrowUtxosByTreasury: publicProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await indexerGetWithParams<UtxoWithSlot[], { policy: string }>(
          `/escrow/utxos`,
          { policy: input.treasuryNftPolicyId },
        );
        return response;
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Escrow UTxOs",
        });
      }
    }),

  getEscrowUtxoByTreasuryByAlias: publicProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
        alias: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await indexerGetWithParams<UtxoWithSlot[], { treasuryNftPolicyId: string, alias: string }>(
          `/escrow/utxos`,
          { treasuryNftPolicyId: input.treasuryNftPolicyId, alias: input.alias },
        );
        return response;
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Escrow UTxOs",
        });
      }
    }),
});
