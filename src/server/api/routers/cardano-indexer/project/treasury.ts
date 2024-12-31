
import { UtxoWithSlot } from "@maestro-org/typescript-sdk";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { indexerGetWithParams } from "~/lib/axios/indexer";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type TreasuryInfo } from "~/types/db";

// TODO: Implement helpful queries using the flexible /treasury/utxos endpoint

export const treasuryValidatorRouter = createTRPCRouter({

  checkProjectToken: publicProcedure
    .input(
      z.object({
        treasuryNftPolicyId: z.string().length(56),
      }),
    )
    .query(async ({ input }) => {
      try {
        const projectTokenUtxos = await indexerGetWithParams<UtxoWithSlot, { policy: string, filter: string }>(
          "/treasury/utxos",
          {
            policy: input.treasuryNftPolicyId,
            filter: "ProjectToken",
          }
        );
        if (!!projectTokenUtxos) {
          return true;
        }
        else {
          return false
        }
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Cannot get Treasury Info",
        });
      }
    }),


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

        // Validate the shape matches our type
        const treasuryInfo: TreasuryInfo = {
          funds: Array.isArray(info.funds) ? info.funds.map(fund => ({
            unit: String(fund.unit),
            amount: Number(fund.amount)
          })) : [],
          projects: Array.isArray(info.projects) ? info.projects.map(project => ({
            project_hash: String(project.project_hash),
            escrow_hash: String(project.escrow_hash),
            commitment_allowed: Number(project.commitment_allowed),
            allowed_contributors: Array.isArray(project.allowed_contributors)
              ? project.allowed_contributors.map(String)
              : []
          })) : []
        };

        return treasuryInfo;
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Cannot get Treasury Info",
        });
      }
    }),

});

