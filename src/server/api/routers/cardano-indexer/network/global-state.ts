import { type DecodedGlobalStateDatum } from "@andamiojs/datum-utils";
import { z } from "zod";

import { indexerGetWithParams } from "~/lib/axios/indexer";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

type GlobalStateQueryParams = {
  alias: string;
};

export const globalStateRouter = createTRPCRouter({
  getDecodedDatum: protectedProcedure
    .input(
      z.object({
        alias: z.string().min(1),
      }),
    )
    .query(async ({ input }) => {
      const globalStateQueryParams: GlobalStateQueryParams = {
        alias: input.alias,
      };
      const globalState = indexerGetWithParams<
        DecodedGlobalStateDatum,
        GlobalStateQueryParams
      >(`/global-state/decoded-datum`, globalStateQueryParams);
      return globalState;
    }),
});
