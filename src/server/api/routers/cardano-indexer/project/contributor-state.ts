import { UtxoWithSlot } from "@maestro-org/typescript-sdk";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { indexerGet } from "~/lib/axios/indexer";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";


// Contributor State
export const contributorStateRouter = createTRPCRouter({
  getAllContributorStateUtxos: publicProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await indexerGet<UtxoWithSlot[]>(
          `/contributor-state/utxos?policy=${input.treasuryNftPolicyId}`,
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
        const response = await indexerGet<UtxoWithSlot[]>(
          `/contributor-state/utxos?policy=${input.treasuryNftPolicyId}&alias=${input.alias}`,
        );
        return response;
      } catch {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot get Contributor State UTxOs",
        });
      }
    }),

  getContributorStateAssetsByAlias: publicProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
        alias: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      try {
        const response = await indexerGet<UtxoWithSlot[]>(
          `/contributor-state/utxos?policy=${input.treasuryNftPolicyId}&alias=${input.alias}`,
        )
        if (response.length > 0 && !!response[0])
          return response[0].assets;

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

});
