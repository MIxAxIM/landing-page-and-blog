import { UtxoWithSlot } from "@maestro-org/typescript-sdk";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import UTxOi from "~/components/transactions/model";
import { indexerGet, indexerGetWithParams } from "~/lib/axios/indexer";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TreasuryInfo } from "~/types/db";


// Contributor State
export const projectValidatorsRouter = createTRPCRouter({
  getAllContributorStateUtxos: publicProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await indexerGet<UTxOi>(
          `/contributor-state/decoded-datum?policy=${input.treasuryNftPolicyId}`,
        );
        return response;
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Contributor State UTxOs",
        });
      }
    }),

  getContributorStateUtxoByAlias: publicProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
        alias: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await indexerGet<UTxOi>(
          `/contributor-state/decoded-datum?policy=${input.treasuryNftPolicyId}&alias=${input.alias}`,
        );
        return response;
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Contributor State UTxOs",
        });
      }
    }),

  getContributorPolicies: publicProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await indexerGet<
          {
            contributorPolicy: string;
            projectNFTPolicy: string;
          }[]
        >(`/contributor-state/policies?policy=${input.treasuryNftPolicyId}`);
        return response;
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Contributor Policies",
        });
      }
    }),

  // Escrow
  getEscrowUtxosByTreasury: publicProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await indexerGet<UtxoWithSlot[]>(
          `/escrow/utxos?policy=${input.treasuryNftPolicyId}`,
        );
        return response;
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Escrow UTxOs",
        });
      }
    }),

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
