import { z } from "zod";
import type UTxOi from "~/components/cardano/model";

import { indexerGetWithParams } from "~/lib/axios/indexer";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const indexValidatorRouter = createTRPCRouter({
  getIndexValidatorUtxos: protectedProcedure
    .input(
      z.object({
        new_alias: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const new_alias: string = input.new_alias
      const globalState = indexerGetWithParams<
        UTxOi,
        { new_alias: string }
      >(`/index-validator/utxos`, { new_alias });
      return globalState;
    }),

  checkAliasAvailability: protectedProcedure
    .input(
      z.object({
        alias: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const alias: string = input.alias

      const isAliasAvailable = indexerGetWithParams<
        boolean, { alias: string }
      >(`/index-validator/alias-availability`, { alias });
      return isAliasAvailable;
    }),
});
