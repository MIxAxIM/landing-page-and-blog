
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TreasuryInfo } from "~/types/db";

// TODO: Implement helpful queries using the flexible /treasury/utxos endpoint

export const treasuryValidatorRouter = createTRPCRouter({

  // Treasury
  // The constructors returned in Treasury UTxO Datum cause TRPC to fail
  // Decide whether we need this query before implementing a fix
  // NOTE: This is a flexible and potentially helpful query
  //getAllUtxosByTreasury: protectedProcedure
  //  .input(
  //    z.object({
  //      treasuryNftPolicyId: z.string().length(56),
  //    }),
  //  )
  //  .query(async ({ input }) => {
  //    const response = indexerGetWithParams<UtxoWithSlot[], { policy: string }>(
  //      `/treasury/utxos`,
  //      { policy: input.treasuryNftPolicyId }
  //    );
  //    return response;
  //  }),

  // NOTE: Duplicated in projectGeneralRouter
  getTreasuryInfo: publicProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const info = await indexerGetWithParams<
          TreasuryInfo,
          { policy: string }
        >("/treasury/info", {
          policy: input.treasuryNftPolicyId,
        });
        return {
          info: info,
        };
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Treasury Info",
        });
      }
    }),
});
