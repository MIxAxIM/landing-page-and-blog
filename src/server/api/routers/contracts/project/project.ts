import { TRPCError } from "@trpc/server";
import { z } from "zod";
import UTxOi from "~/components/transactions/model";
import { indexerGet } from "~/lib/axios/indexer";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// Contributor State
export const projectValidatorRouter = createTRPCRouter({
  getAllContributorStateUtxos: protectedProcedure
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
        return response
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Contributor State UTxOs",
        });
      }
    }),

  getContributorStateUtxoByAlias: protectedProcedure
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
        return response
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Contributor State UTxOs",
        });
      }
    }),

  getContributorPolicies: protectedProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await indexerGet<UTxOi>(
          `/contributor-state/policies?policy=${input.treasuryNftPolicyId}`,
        );
        return response
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Contributor Policies",
        });
      }
    }),

  // Escrow
  getEscrowUtxosByTreasury: protectedProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await indexerGet<UTxOi>(
          `/escrow/utxos?policy=${input.treasuryNftPolicyId}`,
        );
        return response
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Escrow UTxOs",
        });
      }
    }),

  // Treasury
  //
  // TODO: Create routers that use /treasury/utxos with optional params in helpful ways - as needed in UX
  getAllUtxosByTreasury: protectedProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await indexerGet<UTxOi>(
          `/treasury/utxos?policy=${input.treasuryNftPolicyId}`,
        );
        return response
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Treasury UTxOs",
        });
      }
    }),

  getTreasuryInfo: protectedProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await indexerGet<UTxOi>(
          `/treasury/info?policy=${input.treasuryNftPolicyId}`,
        );
        return response
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Treasury Info",
        });
      }
    }),
});
